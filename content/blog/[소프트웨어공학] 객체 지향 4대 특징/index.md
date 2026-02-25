---
title: "[소프트웨어공학] 객체 지향(OOP) 4대 특징 이해하기"
date: "2026-02-24"
slug: "software-engineering-oop-4-principles"
description: "객체 지향 프로그래밍의 근간을 이루는 추상화, 캡슐화, 상속, 다형성의 개념과 필요성을 정리합니다."
thumbnail: "./index.png"
pointColor: "#ffffff"
tags: ["소프트웨어공학"]
keywords: "객체지향, 4대특징, 캡슐화, 상속, 다형성, 추상화, 객체지향프로그래밍, OOP, Object-Oriented Programming"
---

> 프로그래밍 패러다임 중 하나인 `객체 지향 프로그래밍`은 단순히 클래스를 사용하는 것을 넘어, 객체 간의 상호작용을 통해 프로그램을 구성하는 방식입니다. 개발자가 반드시 알아야 할 OOP의 `4가지 특징`을 살펴봅니다.

![](./index.png)

## 객체지향 프로그래밍 (OOP)

객체지향 프로그래밍(Object-Oriented Programming, `OOP`)은 소프트웨어 개발에서 **객체**를 중심으로 프로그램을 구성하는 패러다임이다.

Java, C++, Python 등 많은 현대 프로그래밍 언어가 OOP를 지원하는데, 반대 개념인 `절차적 프로그래밍`과 비교하면 다음과 같은 차이점이 있다.

| 객체지향 프로그래밍                       | 절차적 프로그래밍           |
| ----------------------------------------- | --------------------------- |
| 데이터와 함수를 하나의 단위로 묶음 (객체) | 데이터와 함수를 별도로 관리 |
| 코드의 재사용성 높음                      | 코드의 재사용성 낮음        |
| 유지보수 용이                             | 유지보수 어려움             |

OOP의 핵심 원칙은 `추상화(Abstraction)`, `캡슐화(Encapsulation)`, `상속(Inheritance)`, `다형성(Polymorphism)` 이다.

구현 키워드부터 잡고 가자면 다음과 같다.

- 추상화 : abstract class, interface
- 캡슐화 : private, public, protected
- 상속 : extends
- 다형성 : overriding, overloading

아마 여기까지는 익숙할 수 있을 것이다. 하지만 이 개념들이 객체지향프로그래밍을 할 때 근본적으로 왜 필요한지, 어떤 문제를 해결하기 위해 존재하는지에 대해서는 명확히 이해하지 못하는 경우가 많다.

**구현 예시**와 함께 객체 지향 프로그래밍의 각 4대 특징의 필요성에 대해 살펴보자.

## 1️⃣ Abstraction

#### 1-1. 추상화의 정의

`Abstraction`은 객체의 복잡한 내부 구현을 숨기고, 사용자에게 필요한 최소한의 공통적인 속성과 기능만을 추출하여 정의하는 과정이다. 불필요한 세부 사항은 제거하고 핵심적인 개념에 집중하는 것이 목적이다.

> 💡 **추상화의 예**
>
> 우리가 운전을 할 때 가속 페달과 브레이크의 위치만 알면 되지, 엔진 내부에서 연료가 어떻게 폭발하고 실린더가 어떻게 움직이는지 알 필요가 없는 것과 같다.

#### 1-2. 추상화가 필요한 이유

추상화를 사용하면 다음과 같은 이점을 얻을 수 있다:

1. **복잡도 감소**: 세부 구현을 숨기고 핵심 기능만 노출하여 이해하기 쉬운 코드 작성
2. **유지보수성 향상**: 인터페이스는 그대로 두고 내부 구현만 변경 가능
3. **확장성**: 새로운 구현체를 추가할 때 기존 코드 수정 불필요
4. **코드 재사용**: 공통 기능을 정의하여 여러 곳에서 활용

#### 1-3. 구현 예시

Java에서는 주로 `Interface`나 `Abstract Class`를 통해 `Abstraction`을 구현한다.

##### 1-3-1. Interface를 통한 추상화

```java
// 결제 방식을 추상화한 인터페이스
interface Payment {
    void processPayment(int amount);
    boolean validatePayment();
}

// 신용카드 결제 구현
class CreditCardPayment implements Payment {
    private String cardNumber;
    private String cvv;

    @Override
    public void processPayment(int amount) {
        // 신용카드 결제 처리 로직
        System.out.println("신용카드로 " + amount + "원 결제");
    }

    @Override
    public boolean validatePayment() {
        // 카드 유효성 검증 로직
        return cardNumber != null && cvv != null;
    }
}

// 계좌이체 결제 구현
class BankTransferPayment implements Payment {
    private String accountNumber;

    @Override
    public void processPayment(int amount) {
        // 계좌이체 처리 로직
        System.out.println("계좌이체로 " + amount + "원 결제");
    }

    @Override
    public boolean validatePayment() {
        // 계좌 유효성 검증 로직
        return accountNumber != null;
    }
}

// 사용 예시
public class PaymentProcessor {
    public void processOrder(Payment payment, int amount) {
        // 결제 방식에 상관없이 동일한 인터페이스로 처리
        if (payment.validatePayment()) {
            payment.processPayment(amount);
        }
    }
}
```

위 예시에서 `PaymentProcessor`는 구체적인 결제 방식을 알 필요 없이 `Payment` 인터페이스만 알면 된다. 새로운 결제 방식(예: 카카오페이)을 추가해도 `PaymentProcessor` 코드는 수정할 필요가 없다.

##### 1-3-2. Abstract Class를 통한 추상화

```java
// 공통 기능이 있는 경우 추상 클래스 활용
abstract class Database {
    // 공통 메서드
    public void connect() {
        System.out.println("데이터베이스 연결 시작");
    }

    // 추상 메서드 (하위 클래스에서 구현 필수)
    public abstract void executeQuery(String query);
    public abstract void closeConnection();
}

class MySQLDatabase extends Database {
    @Override
    public void executeQuery(String query) {
        System.out.println("MySQL에서 쿼리 실행: " + query);
    }

    @Override
    public void closeConnection() {
        System.out.println("MySQL 연결 종료");
    }
}

class MongoDatabase extends Database {
    @Override
    public void executeQuery(String query) {
        System.out.println("MongoDB에서 쿼리 실행: " + query);
    }

    @Override
    public void closeConnection() {
        System.out.println("MongoDB 연결 종료");
    }
}
```

## 2️⃣ Encapsulation

#### 2-1. 캡슐화의 개념

`Encapsulation`은 서로 연관된 데이터(속성)와 메서드(기능)를 하나의 단위로 묶고, 내부 데이터를 외부로부터 보호하는 것을 의미한다. 이를 통해 객체의 내부 상태가 외부의 잘못된 조작으로 인해 오염되는 것을 방지한다.

#### 2-2. 캡슐화가 필요한 이유

캡슐화는 다음과 같은 중요한 역할을 한다:

1. **데이터 무결성 보장**: 잘못된 값이 할당되는 것을 방지
2. **결합도 감소**: 내부 구현 변경 시 외부 코드에 영향 최소화
3. **보안 강화**: 중요한 데이터를 외부로부터 보호
4. **유지보수성**: 변경의 영향 범위를 최소화하여 안전한 리팩토링 가능

캡슐화가 없다면 다음과 같은 문제가 발생할 수 있다:

```java
// ❌ 캡슐화가 없는 경우
class BankAccount {
    public int balance;  // 외부에서 직접 접근 가능
}

// 잘못된 사용
BankAccount account = new BankAccount();
account.balance = -1000;  // 음수 잔액 설정 가능! (논리적 오류)
account.balance = account.balance + 1000000;  // 검증 없는 직접 수정
```

#### 2-3. 접근 제어자와 정보 은닉

`Encapsulation`을 달성하기 위해 `Access Modifier`를 사용하며, 외부에는 필요한 메서드만을 노출한다.

| 접근 제어자 | 설명                                              |
| ----------- | ------------------------------------------------- |
| `private`   | 해당 클래스 내부에서만 접근 가능 (가장 높은 보안) |
| `public`    | 어디서든 접근 가능                                |
| `protected` | 상속 관계의 클래스나 동일 패키지에서 접근 가능    |

```java
// ✅ 캡슐화를 적용한 경우
public class BankAccount {
    // 1. 데이터를 private으로 보호 (정보 은닉)
    private int balance;
    private String accountNumber;

    // 생성자
    public BankAccount(String accountNumber, int initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance > 0 ? initialBalance : 0;
    }

    // 2. 메서드를 통해서만 데이터에 접근 (캡슐화)
    public void deposit(int amount) {
        if (amount > 0) {
            this.balance += amount;
            System.out.println(amount + "원 입금 완료. 잔액: " + balance);
        } else {
            System.out.println("입금액은 0보다 커야 합니다.");
        }
    }

    public void withdraw(int amount) {
        if (amount > 0 && amount <= balance) {
            this.balance -= amount;
            System.out.println(amount + "원 출금 완료. 잔액: " + balance);
        } else {
            System.out.println("출금 불가: 잔액 부족 또는 잘못된 금액");
        }
    }

    // getter: 읽기 전용 접근
    public int getBalance() {
        return balance;
    }

    public String getAccountNumber() {
        return accountNumber;
    }
}

// 사용 예시
public class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount("123-456-789", 10000);

        // ✅ 캡슐화된 메서드를 통한 안전한 접근
        account.deposit(5000);      // 15000원
        account.withdraw(3000);     // 12000원
        account.withdraw(20000);    // 출금 불가 (잔액 부족)

        // ❌ 이제 직접 접근 불가
        // account.balance = -1000;  // 컴파일 에러!
    }
}
```

위 예시에서 `balance`는 private으로 보호되어 외부에서 직접 접근할 수 없다. `deposit()`과 `withdraw()` 메서드를 통해서만 잔액을 변경할 수 있으며, 각 메서드에서 유효성 검사를 수행하여 데이터 무결성을 보장한다.

## 3️⃣ Inheritance

#### 3-1. 상속의 정의

`Inheritance`는 상위 클래스(부모)의 특성을 하위 클래스(자식)가 물려받아 재사용하는 것을 의미한다. 코드의 중복을 줄이고 계층적인 구조를 설계할 수 있게 한다.

#### 3-2. 상속이 필요한 이유

상속을 사용하면 다음과 같은 장점이 있다:

1. **코드 재사용**: 공통 기능을 부모 클래스에 작성하여 중복 제거
2. **계층적 분류**: 객체 간의 관계를 명확하게 표현
3. **유지보수 용이**: 공통 기능 수정 시 부모 클래스만 수정하면 모든 자식 클래스에 반영
4. **확장성**: 기존 코드를 수정하지 않고 새로운 기능 추가 가능

상속이 없다면 다음과 같은 문제가 발생한다:

```java
// ❌ 상속 없이 중복 코드가 발생하는 경우
class Employee {
    private String name;
    private int age;
    private String employeeId;

    public void work() { /* 근무 */ }
    public void eat() { /* 식사 */ }
    public void sleep() { /* 수면 */ }
}

class Student {
    private String name;      // 중복!
    private int age;          // 중복!
    private String studentId;

    public void study() { /* 공부 */ }
    public void eat() { /* 식사 */ }    // 중복!
    public void sleep() { /* 수면 */ }  // 중복!
}
```

#### 3-3. 구현 예시

Java에서는 `extends` 키워드를 사용하여 상속을 구현한다.

```java
// ✅ 상속을 활용하여 중복 제거
class Person {
    // 공통 속성
    protected String name;
    protected int age;
    protected String address;

    public Person(String name, int age, String address) {
        this.name = name;
        this.age = age;
        this.address = address;
    }

    // 공통 메서드
    public void eat() {
        System.out.println(name + "이(가) 식사를 합니다.");
    }

    public void sleep() {
        System.out.println(name + "이(가) 잠을 잡니다.");
    }

    public void introduce() {
        System.out.println("이름: " + name + ", 나이: " + age);
    }
}

// Student는 Person의 모든 속성과 메서드를 상속받음
class Student extends Person {
    private String studentId;
    private String major;

    public Student(String name, int age, String address,
                   String studentId, String major) {
        super(name, age, address);  // 부모 클래스 생성자 호출
        this.studentId = studentId;
        this.major = major;
    }

    // Student만의 고유 메서드
    public void study() {
        System.out.println(name + "이(가) " + major + "를 공부합니다.");
    }

    // 부모 메서드를 재정의 (Overriding)
    @Override
    public void introduce() {
        super.introduce();  // 부모의 introduce 호출
        System.out.println("전공: " + major + ", 학번: " + studentId);
    }
}

class Employee extends Person {
    private String employeeId;
    private String department;
    private int salary;

    public Employee(String name, int age, String address,
                    String employeeId, String department, int salary) {
        super(name, age, address);
        this.employeeId = employeeId;
        this.department = department;
        this.salary = salary;
    }

    // Employee만의 고유 메서드
    public void work() {
        System.out.println(name + "이(가) " + department + "에서 근무합니다.");
    }

    @Override
    public void introduce() {
        super.introduce();
        System.out.println("부서: " + department + ", 사번: " + employeeId);
    }
}

// 사용 예시
public class Main {
    public static void main(String[] args) {
        Student student = new Student("김철수", 20, "서울", "2024001", "컴퓨터공학");
        student.introduce();  // Person + Student의 정보 출력
        student.study();      // Student 고유 메서드
        student.eat();        // Person으로부터 상속받은 메서드

        Employee employee = new Employee("이영희", 30, "부산", "E2024001", "개발팀", 5000);
        employee.introduce(); // Person + Employee의 정보 출력
        employee.work();      // Employee 고유 메서드
        employee.sleep();     // Person으로부터 상속받은 메서드
    }
}
```

#### 3-4. 상속 사용 시 주의사항

> 💡 **Is-A 관계**
> 상속은 "자식 클래스는 부모 클래스의 한 종류이다(A Student is a Person)"라는 관계가 성립할 때 사용하는 것이 적절하다.
> 기능 확장의 목적일 경우 상속보다는 `Composition`을 고려해야 한다.

상속을 써야 할 때는 **리스코프 치환 원칙(Liskov Substitution Principle)**을 준수하는 것이 중요하다. 부모 클래스의 객체를 자식 클래스의 객체로 대체해도 프로그램이 정상적으로 작동해야 한다는 원칙이다.

해당 정보는 [객체지향 설계 원칙](https://www.baeldung.com/java-solid-principles) 이 글에서 자세히 다루고 있다.

## 4️⃣ **Polymorphism**

#### 4-1. 다형성의 개념

`Polymorphism`은 하나의 객체가 여러 가지 타입을 가질 수 있는 성질을 의미한다. 즉, 부모 클래스 타입의 참조 변수로 자식 클래스 타입의 인스턴스를 참조할 수 있는 특징이다.

#### 4-2. 다형성이 필요한 이유

다형성은 객체 지향 프로그래밍의 가장 강력한 특징 중 하나로, 다음과 같은 이점을 제공한다:

1. **확장성**: 새로운 타입 추가 시 기존 코드 수정 불필요 (개방-폐쇄 원칙)
2. **유연성**: 하나의 인터페이스로 다양한 객체를 처리
3. **결합도 감소**: 구체적인 타입이 아닌 추상 타입에 의존
4. **코드 간결성**: 타입별 분기 처리 없이 통일된 방식으로 처리

다형성이 없다면:

```java
// ❌ 다형성 없이 타입별로 처리하는 경우
public void processPayment(String paymentType, int amount) {
    if (paymentType.equals("CARD")) {
        // 카드 결제 로직
    } else if (paymentType.equals("BANK")) {
        // 계좌이체 로직
    } else if (paymentType.equals("KAKAO")) {
        // 카카오페이 로직
    }
    // 새로운 결제 방식이 추가될 때마다 이 메서드를 수정해야 함!
}
```

#### 4-3. Overriding과 Overloading

다형성을 구현하는 대표적인 방식 두 가지는 다음과 같다.

- **Overriding (오버라이딩)**: 부모 클래스의 메서드를 자식 클래스에서 목적에 맞게 재정의하는 것.
- **Overloading (오버로딩)**: 같은 이름의 메서드를 매개변수의 타입이나 개수를 다르게 하여 여러 개 정의하는 것.

#### 4-4. 구현 예시

##### 4-4-1. Overriding을 통한 다형성

```java
// ✅ 다형성을 활용한 확장 가능한 설계
interface Shape {
    void draw();
    double calculateArea();
}

class Circle implements Shape {
    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public void draw() {
        System.out.println("원을 그립니다. 반지름: " + radius);
    }

    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

class Rectangle implements Shape {
    private double width;
    private double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public void draw() {
        System.out.println("사각형을 그립니다. " + width + " x " + height);
    }

    @Override
    public double calculateArea() {
        return width * height;
    }
}

class Triangle implements Shape {
    private double base;
    private double height;

    public Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }

    @Override
    public void draw() {
        System.out.println("삼각형을 그립니다. 밑변: " + base + ", 높이: " + height);
    }

    @Override
    public double calculateArea() {
        return (base * height) / 2;
    }
}

// 다형성 활용
public class DrawingApp {
    // Shape 타입 하나로 모든 도형 처리 가능
    public void renderShape(Shape shape) {
        shape.draw();
        System.out.println("면적: " + shape.calculateArea());
    }

    public void renderMultipleShapes(Shape[] shapes) {
        for (Shape shape : shapes) {
            renderShape(shape);
            System.out.println("---");
        }
    }

    public static void main(String[] args) {
        DrawingApp app = new DrawingApp();

        // 다양한 타입의 객체를 하나의 배열로 관리
        Shape[] shapes = {
            new Circle(5.0),
            new Rectangle(4.0, 6.0),
            new Triangle(3.0, 4.0)
        };

        // 타입에 상관없이 동일한 방식으로 처리
        app.renderMultipleShapes(shapes);

        // 새로운 도형(예: Pentagon)을 추가해도
        // renderShape 메서드는 수정할 필요 없음!
    }
}
```

##### 4-4-2. Overloading 예시

```java
class Calculator {
    // 같은 이름의 메서드지만 매개변수가 다름
    public int add(int a, int b) {
        return a + b;
    }

    public double add(double a, double b) {
        return a + b;
    }

    public int add(int a, int b, int c) {
        return a + b + c;
    }

    // 가변 인자를 사용한 오버로딩
    public int add(int... numbers) {
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        return sum;
    }
}

public class Main {
    public static void main(String[] args) {
        Calculator calc = new Calculator();

        System.out.println(calc.add(1, 2));           // int 버전 호출
        System.out.println(calc.add(1.5, 2.3));       // double 버전 호출
        System.out.println(calc.add(1, 2, 3));        // 3개 매개변수 버전
        System.out.println(calc.add(1, 2, 3, 4, 5)); // 가변 인자 버전
    }
}
```

##### 4-4-3. 실전 예시: 알림 시스템

```java
// 다형성을 활용한 알림 시스템
interface Notification {
    void send(String message);
}

class EmailNotification implements Notification {
    private String email;

    public EmailNotification(String email) {
        this.email = email;
    }

    @Override
    public void send(String message) {
        System.out.println("[이메일] " + email + "로 전송: " + message);
    }
}

class SMSNotification implements Notification {
    private String phoneNumber;

    public SMSNotification(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    @Override
    public void send(String message) {
        System.out.println("[SMS] " + phoneNumber + "로 전송: " + message);
    }
}

class PushNotification implements Notification {
    private String deviceId;

    public PushNotification(String deviceId) {
        this.deviceId = deviceId;
    }

    @Override
    public void send(String message) {
        System.out.println("[푸시] 기기 " + deviceId + "로 전송: " + message);
    }
}

// 알림 관리자
class NotificationManager {
    private List<Notification> notifications = new ArrayList<>();

    public void addNotification(Notification notification) {
        notifications.add(notification);
    }

    // 모든 알림 채널로 메시지 전송 (다형성 활용)
    public void sendToAll(String message) {
        for (Notification notification : notifications) {
            notification.send(message);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        NotificationManager manager = new NotificationManager();

        // 다양한 알림 방식 추가
        manager.addNotification(new EmailNotification("user@example.com"));
        manager.addNotification(new SMSNotification("010-1234-5678"));
        manager.addNotification(new PushNotification("device-123"));

        // 모든 채널로 한 번에 전송 (각 객체의 구체적인 타입을 몰라도 됨)
        manager.sendToAll("새로운 메시지가 도착했습니다!");
    }
}
```

다형성 덕분에 `NotificationManager`는 새로운 알림 방식(예: Slack, Discord)이 추가되어도 코드 수정 없이 확장할 수 있다.
