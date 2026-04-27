---
title: "[데이터베이스] 트랜잭션 격리 수준 4단계 쉽게 이해하기"
date: 2026-04-27
slug: database-isolation-level
description: SQL 표준 Isolation Level 4단계와 각 수준에서 발생 가능한 이상 현상을 다룬다.
thumbnail: index.png
pointColor: "#ffffff"
tags: ["DB"]
keywords: "데이터베이스, 격리성 수준, Isolation Level, Dirty Read, Lost Update, Non-repeatable Read, Phantom Read"
---

> 트랜잭션의 ACID 중 `격리성(Isolation)`은 동시에 실행되는 트랜잭션들이 서로 영향을 미치지 않아야 한다는 성질이다. 
> 
> 격리 수준이 왜 필요한지, 이상 현상의 종류는 무엇인지, SQL 표준이 정의한 `4단계 격리 수준 (Isolation Level)` 을 이해해보자. 

![](./index.png)

## 1️⃣ 격리 수준이란

`격리 수준`은 동시에 실행되는 트랜잭션들이 서로를 얼마나 볼 수 있는지를 결정하는 개념이다.

`격리성`을 완벽하게 보장하려면 트랜잭션을 순차적으로 실행해야 한다. 그러나 이는 성능을 크게 저하시킨다. 따라서 현실에서는 격리 수준을 조절하여 성능과 데이터 정합성 사이에서 적절한 균형을 찾는다.

## 2️⃣ 왜 격리 수준이 필요한가

트랜잭션 간 격리가 완전하지 않으면 이상 현상이 발생할 수 있다.

`격리 수준`을 높일수록 이상 현상은 줄어들지만, 동시성이 낮아져 성능이 떨어진다. 반대로 `격리 수준`을 낮추면 성능은 높아지지만 이상 현상이 발생할 수 있다.

## 3️⃣ 이상 현상

SQL 표준은 `격리 수준`을 정의하는 기준으로 세 가지 이상 현상을 사용한다.

#### 3-1 Dirty Read

`Dirty Read`는 **commit되지 않은 데이터를 다른 트랜잭션이 읽는** 현상이다.

```java
// T1이 아직 commit하지 않은 데이터를 T2가 읽음
T1: write(A = 200)   // A를 100 → 200으로 수정, 아직 commit 전
T2: read(A)          // A = 200 읽음 (미완성 데이터)
T1: rollback         // T1 취소 → A는 다시 100
// T2는 존재하지 않는 값인 200을 읽은 셈이 됨
```

T1이 rollback되면 T2가 읽은 값은 실제로 반영된 적 없는 값이 된다.

#### 3-2 Non-repeatable Read

`Non-repeatable Read`는 **같은 트랜잭션 안에서 같은 데이터를 두 번 읽었을 때 값이 달라지는** 현상이다.

```java
T1: read(A)          // A = 100 읽음
T2: write(A = 200)
T2: commit
T1: read(A)          // A = 200 읽음 (같은 트랜잭션인데 다른 값)
```

T1 입장에서 A는 변하지 않아야 하지만, T2의 commit이 중간에 끼어들어 값이 바뀐다.

#### 3-3 Phantom Read

`Phantom Read`는 **같은 조건의 쿼리를 두 번 실행했을 때 결과 행의 수가 달라지는** 현상이다.

```java
// T1이 조건 쿼리를 두 번 실행
T1: SELECT * FROM orders WHERE amount > 100   // 결과: 3건
T2: INSERT INTO orders VALUES (150)
T2: commit
T1: SELECT * WHERE amount > 100   // 결과: 4건 (유령 행 등장)
```

T1이 처음 읽을 때 없던 행이 두 번째 읽을 때 나타난다.

## 4️⃣ SQL 표준 Isolation Level

SQL 표준은 위의 세 가지 이상 현상을 기준으로 4단계의 Isolation Level을 정의한다.

#### 4-1 Read Uncommitted

**commit되지 않은 데이터도 읽을 수 있는** 가장 낮은 격리 수준이다.

- `Dirty Read`, `Non-repeatable Read`, `Phantom Read` 모두 발생 가능하다.
- 격리를 거의 하지 않으므로 동시성은 가장 높다.
- 데이터 정합성이 중요하지 않은 경우에만 사용한다.

#### 4-2 Read Committed

**commit된 데이터만 읽을 수 있는** 격리 수준이다.

- `Dirty Read`는 방지된다.
- `Non-repeatable Read`, `Phantom Read`는 여전히 발생 가능하다.
- 대부분의 DBMS(Oracle, PostgreSQL 등)에서 **default 격리 수준**으로 사용된다.

```java
T1: read(A)          // A = 100 (T2의 변경 전)
T2: write(A = 200)
T2: commit
T1: read(A)          // A = 200 (commit된 값을 읽음 → Non-repeatable Read 발생)
```

#### 4-3 Repeatable Read

**트랜잭션이 시작된 이후 읽은 데이터는 트랜잭션이 끝날 때까지 동일하게 유지되는** 격리 수준이다.

- `Dirty Read`, `Non-repeatable Read`는 방지된다.
- `Phantom Read`는 발생 가능하다.
- MySQL InnoDB의 **default 격리 수준**이다.

```java
T1: read(A)          // A = 100
T2: write(A = 200)
T2: commit
T1: read(A)          // A = 100 (처음 읽은 값 유지 → Non-repeatable Read 방지)
```

> 💡 **MySQL InnoDB의 Phantom Read 처리**
>
> MySQL InnoDB는 Repeatable Read 수준에서도 **MVCC(Multi-Version Concurrency Control)** 와 **Gap Lock**을 통해 Phantom Read를 상당 부분 방지한다. 따라서 표준 정의와 실제 동작이 다를 수 있다.

#### 4-4 Serializable

**트랜잭션들이 완전히 순차적으로 실행되는 것과 동등한** 가장 높은 격리 수준이다.

- `Dirty Read`, `Non-repeatable Read`, `Phantom Read` 모두 방지된다.
- 동시에 같은 데이터에 접근하는 트랜잭션은 순서를 기다려야 한다.
- 가장 안전하지만 성능이 가장 낮다.

## 5️⃣ Isolation Level 비교

| Isolation Level    | Dirty Read | Non-repeatable Read | Phantom Read |
| ------------------ | ---------- | ------------------- | ------------ |
| `Read Uncommitted` | 발생       | 발생                | 발생         |
| `Read Committed`   | 방지       | 발생                | 발생         |
| `Repeatable Read`  | 방지       | 방지                | 발생         |
| `Serializable`     | 방지       | 방지                | 방지         |

격리 수준이 높아질수록 방지하는 이상 현상이 늘어나고, 동시성(성능)은 낮아진다.

## 6️⃣ 실무에서의 해석

#### 6-1 DBMS마다 다르게 동작한다

SQL 표준의 Isolation Level은 **무엇을 허용하고 금지하는지**를 정의할 뿐, 구현 방식은 DBMS마다 다르다.

| DBMS         | Default Isolation Level | 구현 방식          |
| ------------ | ----------------------- | ------------------ |
| MySQL InnoDB | `Repeatable Read`       | MVCC + Gap Lock    |
| PostgreSQL   | `Read Committed`        | MVCC               |
| Oracle       | `Read Committed`        | MVCC               |
| SQL Server   | `Read Committed`        | Lock 기반 (기본값) |

같은 격리 수준 이름이라도 내부 구현과 실제 동작이 다를 수 있으므로, 사용하는 DBMS의 문서를 확인하는 것이 중요하다.

#### 6-2 Default Isolation Level의 중요성

대부분의 애플리케이션은 격리 수준을 명시적으로 설정하지 않고 DBMS의 default를 따른다. 따라서 **어떤 DBMS를 사용하는지에 따라 기본적으로 어느 수준의 이상 현상이 허용되는지 알고 있어야 한다.**

- MySQL 기반 서비스라면 기본적으로 `Repeatable Read`가 적용된다.
- PostgreSQL, Oracle 기반이라면 `Read Committed`가 기본이다.

격리 수준을 변경하려면 트랜잭션 시작 전에 명시적으로 설정한다.

```java
// JDBC 기준
connection.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
```
