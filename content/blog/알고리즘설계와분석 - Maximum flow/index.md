---
title: 알고리즘설계와분석 - 최대 유량 문제 (Maximum Flow)
slug: "algorithm-maximum-flow"
date: 2025-12-16
description: 네트워크에서 최대 유량을 찾는 Max Flow 문제와 Ford-Fulkerson 알고리즘, 그리고 실전 응용 문제에 대해 정리한다.
thumbnail: "./index.png"
pointColor: "#ffffff"
tags: ["알고리즘"]
keywords: "알고리즘, 최대 유량, Maximum Flow, Max Flow, Ford-Fulkerson, 네트워크 플로우, Network Flow, 그래프, Graph, 최소 컷"
---

> 학부 수업 "알고리즘설계와분석" 내용을 정리한다. 

## 1️⃣ Max Flow 문제 소개

네트워크 플로우의 최대 유량(Max Flow) 문제는 방향 그래프에서 **source(s)** 에서 **sink(t)** 로 보낼 수 있는 최대 데이터량을 구하는 문제다.

#### 1-1 기본 개념

**🔥 Capacity**

간선이 보낼 수 있는 최대 양을 의미한다. 예를 들어 `(u → v)`의 capacity가 20이면, 그 간선으로 최대 20까지 전송할 수 있다.

**🔥 Flow의 정의**

Flow `f(u,v)`는 다음 조건을 만족해야 한다:

| 조건                    | 설명                                          |
| ----------------------- | --------------------------------------------- |
| **Capacity Constraint** | `0 ≤ f(u,v) ≤ c(u,v)` (용량을 초과할 수 없음) |
| **Flow Conservation**   | 중간 정점에서 들어오는 유량 = 나가는 유량     |
| **Non-negativity**      | 음수 유량 불가                                |

#### 1-2 Flow Conservation의 수식 표현

모든 중간 정점 `v ≠ s,t`에 대해:

```
∑ f(u,v) = ∑ f(v,w)
```

- **source**: `outgoing − incoming = flow value`
- **sink**: `incoming − outgoing = flow value`

#### 1-3 Max Flow의 목표

출발점 s에서 도착점 t까지 보낼 수 있는 **유량의 최대값**을 찾는 것이다.

단순히 s의 outgoing capacity만 보고 판단할 수 없다. 중간 정점의 out-capacity가 bottleneck이 될 수 있기 때문이다.

---

## 2️⃣ Ford-Fulkerson 알고리즘

Max Flow 문제를 해결하는 대표적인 알고리즘이다.

#### 2-1 알고리즘의 기본 전략

**🔥 Greedy 방식의 동작 원리**

1. **Residual 그래프**에서 s→t 경로를 하나 찾는다
2. 그 경로에서 보낼 수 있는 최소 capacity(병목)을 흘린다
3. 사용한 용량만큼 forward capacity를 줄이고, backward edge에 되돌릴 수 있는 용량을 만든다
4. 더 이상 s→t 경로가 없어질 때까지 반복한다

이때 찾은 경로를 **augmenting path**라 부른다.

#### 2-2 Residual Graph

**🔥 Residual Graph의 개념**

현재 flow 이후에 더 보낼 수 있는 용량을 나타낸 그래프다.

Flow가 f일 때, 간선 `(u,v)`에 대해:

- **Forward residual capacity**: `c_f(u,v) = c(u,v) - f(u,v)`
- **Backward residual capacity**: `c_f(v,u) = f(u,v)`

Backward edge는 이미 보낸 flow를 **되돌릴 수 있는 여지**를 표현한다.

> 💡 **왜 역방향 간선을 추가하는가?**
>
> 초기에 선택한 경로가 최적이 아닐 수 있다. 역방향 간선을 통해 이전에 흘린 유량을 재조정할 수 있는 기회를 제공한다. 이를 통해 더 나은 경로를 찾을 수 있다.

#### 2-3 Augmenting Path

Residual graph `G_f`에서 **S → T로 가는 단순 경로(simple path)** 를 의미한다.

이 경로가 존재하면 최소 residual capacity만큼 flow를 증가시킬 수 있다.

**augmenting path 존재 ⇔ flow가 아직 max가 아님**

#### 2-4 알고리즘 Pseudocode

```python
# 모든 edge의 flow를 0으로 초기화
for each edge (u,v):
    f(u,v) = 0

# Residual graph를 원본 그래프로 초기화
G_f = G

# Residual graph에서 S → T 경로가 존재하는 동안 반복
while G_f에서 S → T 경로 p 존재:
    # 경로의 최소 residual capacity 찾기
    Δ = min{c_f(u,v) : (u,v) in p}

    # 모든 edge에 대해 flow 증가
    for each edge (u,v) in p:
        f(u,v) += Δ

    # residual graph 갱신
    update G_f

# 종료 시 flow는 max flow
return f
```

#### 2-5 알고리즘 동작 예시

다음 절차를 반복한다:

1. `s→a→d→t` 경로 찾기 → bottleneck은 8 → flow = 8
2. 용량 갱신 후, 새로운 residual graph에서 `s→a→c→t` 경로 찾기 → bottleneck은 2 → flow = 10
3. 역방향 간선을 이용한 경로 `s→c→d→a→c→t` 찾기 → bottleneck은 2 → flow = 12

augmenting path가 더 이상 존재하지 않을 때가 max flow다.

#### 2-6 종료 조건

- Residual graph에서 **S → T 경로가 없을 때** 알고리즘이 종료된다
- 이때의 flow가 **Max Flow**다

---

## 3️⃣ Max-Flow Min-Cut Theorem

Ford-Fulkerson 알고리즘의 정당성을 증명하는 핵심 정리다.

#### 3-1 Cut의 정의

**🔥 Cut `(A,B)`**

정점 집합을 두 부분으로 분리하는 것으로, `s ∈ A, t ∈ B`를 만족한다.

**Cut의 capacity**

```
c(A,B) = ∑(u∈A, v∈B) c(u,v)
```

**Cut에서의 flow**

```
f(A,B) = ∑ f(u,v) - ∑ f(v,u)
```

#### 3-2 Max-Flow Min-Cut Theorem

```
Max Flow = Min Cut
```

**🔥 정리의 의미**

- 어떤 flow도 **모든 cut의 capacity를 초과할 수 없다**
- 가장 작은 cut(bottleneck)이 최대 유량을 제한한다

#### 3-3 Correctness 증명

Ford-Fulkerson 알고리즘의 정당성은 귀류법으로 증명한다:

1. 알고리즘이 종료했다고 가정
2. 그런데 `flow < min-cut` 이라면
3. 모든 cut에 여유 capacity가 존재
4. ⇒ residual graph에 S→T 경로가 존재
5. ⇒ 알고리즘은 종료되지 않았어야 함 (모순)

**결론**: 종료 시 flow = max flow

---

## 4️⃣ 시간 복잡도

#### 4-1 복잡도 분석

**한 번의 반복**

- 경로 찾기: `O(E)`
- residual graph update: `O(E)`

**반복 횟수**

- 최악의 경우: flow 값을 1씩 증가
- 반복 횟수 ≤ max flow ≤ min cut

**전체 시간 복잡도**

```
O(E · max-flow)
```

#### 4-2 Pseudo-polynomial

**🔥 왜 pseudo-polynomial인가?**

시간 복잡도가 입력 크기가 아닌 **입력 값의 크기**에 의존한다. capacity가 정수일 때만 종료가 보장된다.

---

## 5️⃣ Max Flow의 응용

### Bipartite Matching

#### 5-1 문제 변환

이분 그래프의 최대 매칭 문제를 Max Flow로 변환할 수 있다:

1. `source → left partition` (capacity 1)
2. `right partition → sink` (capacity 1)
3. `original edges` (capacity 1)

**결과**: `Max Flow = Maximum Matching`

> 💡 **왜 한 정점이 두 번 매칭되지 않는가?**
>
> 각 정점으로 들어오고 나가는 간선의 capacity가 모두 1이므로, flow conservation에 의해 한 정점은 최대 1개의 간선만 사용할 수 있다.

### Edge-Disjoint Paths

#### 5-2 경로 분리 문제

모든 edge capacity를 1로 설정하고 max flow를 계산하면:

```
Max Flow = Edge-disjoint paths 수
```

각 간선이 한 번만 사용되므로, 찾은 경로들은 서로 간선을 공유하지 않는다.

### Vertex Capacity 처리

#### 5-3 정점 용량 모델링

정점에 용량 제한이 있는 경우, 다음과 같이 변환한다:

1. 각 vertex `v`를 `v → v'`로 분리
2. 간선 `(v, v')`에 capacity = vertex capacity 설정
3. 모든 incoming edges → v
4. 모든 outgoing edges ← v'

이를 통해 vertex capacity를 edge capacity로 변환하여 표준 Max Flow 알고리즘을 적용할 수 있다.
