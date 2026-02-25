---
title: "초심자 입장에서 Flutter Riverpod을 '잘' 사용하는 방법 (장문)"
slug: "how-to-use-flutter-riverpod"
date: "2025-09-20"
description: "React에 익숙한 개발자 입장에서 투두리스트를 구현하며 Flutter의 Riverpod 사용법을 다뤄봅니다."
thumbnail: "./index.png"
pointColor: "#0468d7"
tags: ["Web"]
keywords: "Flutter, Riverpod, 상태관리, State Management, Dart, 모바일 개발, TODO, 투두리스트, Provider, React, 크로스플랫폼"
---


> LG전자 산학 캡스톤에서 Flutter로 프로젝트를 진행하기 전 프리코스로 TODO 리스트 개발 과제가 주어졌다. 이 글에서는 TODO 리스트 실습을 통해 어떻게 Riverpod을 통한 상태구현을 잘 구현할 수 있는지 다뤄본다.

![](./index.png)

### 📋 과제 요구사항

- 투두리스트 기본적인 기능 구현
- Riverpod 상태 관리 구현
- DevTools 사용
- README 파일 작성
  - 상태 자료구조, 위젯 구현 설명
  - DevTools에서 Inspector&Timeline&Memory&Performance 화면 스크린샷

위 과제를 수행하며 나는 Flutter, Riverpod 공식문서를 살펴보면서 관련 내용을 학습하며 투두 리스트를 완성했다.

[➡️ 작업 레포지토리](https://github.com/rmdnps10/CSE4103-Flutter-TODO)

오늘은 이 과정 속 내가 학습한 내용에 대해 다뤄보고자 한다.

## 1️⃣ Riverpod 핵심 개념

#### 1-1 `Riverpod` 소개

Riverpod은 Flutter에서 사용하는 `상태 관리 라이브러리`다. 쉽게 말해서 앱의 데이터를 여러 화면에서 공유하고 관리할 수 있게 해주는 도구라고 생각하면 된다.

##### 왜 상태 관리가 필요할까?🤔

Flutter에서 기본적으로 제공하는 `setState()`는 한 화면 안에서만 데이터를 관리할 수 있다. 하지만 실제 앱을 만들다 보면:

- 로그인한 사용자 정보를 여러 화면에서 사용해야 한다
- 장바구니 데이터를 상품 목록과 결제 화면에서 공유해야 한다
- 다크 모드 설정을 전체 앱에 적용해야 한다

이럴 때 Riverpod이 빛을 발한다!

##### Riverpod의 장점

- **타입 안전성**: 컴파일할 때 오류를 미리 잡아준다
- **테스트하기 쉬움**: 가짜 데이터로 테스트하기 편하다
- **DevTools 지원**: 상태 변화를 눈으로 확인할 수 있다
- **확장성**: 큰 프로젝트에서도 깔끔하게 관리된다

#### 1-2 Riverpod 아키텍처

Riverpod은 4가지 핵심 요소로 구성되어 있다:

1. `Provider` : 데이터를 생성하고 관리하는 역할
2. `ProviderScope`: Provider들이 작동할 수 있는 환경을 제공하는 Widget
3. `Ref`: Provider와 Consumer를 연결하는 다리 역할
4. `Consumer Widget`: Provider의 데이터를 구독하고 UI에 표시하는 특별한 Widget



> **💡 참고:** 실제로는 ProviderContainer가 핵심 관리 시스템이지만, Flutter 앱에서는 `ProviderScope`(Widget 버전)를 사용하는 것이 권장된다. Todo 앱에서도 ProviderScope를 사용했다!

이제 각각을 자세히 알아보자!

#### 1-3 Provider 핵심 개념

Provider는 **데이터를 제공하는 상점**이다. 앱에서 필요한 데이터를 생성하고 관리하는 역할을 한다.

**Provider 타입별 특징:**

```dart
// 🎯 StateProvider - 간단한 값 하나를 관리
final counterProvider = StateProvider<int>((ref) => 0);

// 🧠 NotifierProvider - 복잡한 로직이 있는 상태 관리
final todoListProvider = NotifierProvider<TodoNotifier, List<Todo>>(
  TodoNotifier.new
);

// ⏰ FutureProvider - 비동기 데이터 관리
final weatherProvider = FutureProvider<Weather>((ref) async {
  return await api.getWeather();
});

// 🔄 StreamProvider - 실시간 데이터 스트림
final chatProvider = StreamProvider<List<Message>>((ref) {
  return chatService.messagesStream;
});
```

**Provider 타입 선택 가이드:**

| Provider 타입      | 사용 시기            | 예시                  |
| ------------------ | -------------------- | --------------------- |
| `StateProvider`    | 간단한 값 하나       | 카운터, 다크모드 설정 |
| `NotifierProvider` | 복잡한 비즈니스 로직 | Todo 리스트, 장바구니 |
| `FutureProvider`   | API 호출 (비동기)    | 사용자 프로필 조회    |
| `StreamProvider`   | 실시간 데이터        | 채팅, 알림            |

#### 1-4 ProviderScope 핵심 개념

ProviderScope는 Riverpod의 **Flutter 전용 진입점**이다. 모든 Provider들이 작동할 수 있는 **환경을 제공**하는 특별한 Widget이다.

**Todo 앱에서 ProviderScope를 선택한 이유:**

```dart
// main.dart - 앱의 시작점
void main() {
  runApp(
    ProviderScope(  // 👈 Flutter 앱에서는 이것을 사용!
      child: TodoApp(),
    ),
  );
}
```

**ProviderScope vs ProviderContainer:**

- **ProviderContainer**: Riverpod의 **핵심 엔진** (모든 상태 관리의 중심)
- **ProviderScope**: ProviderContainer의 **Widget 래퍼** (Flutter 앱에서 사용하기 위한 형태)

Todo 앱에서는 Flutter Widget 트리와 자연스럽게 통합되어야 하므로 ProviderScope를 사용했다!

##### ProviderScope의 역할

1. **🏠 Provider 환경 제공**: Provider들이 작동할 수 있는 컨텍스트 생성
2. **🔧 테스트 지원**: 특정 Provider를 가짜 구현으로 교체 가능
3. **💾 자동 메모리 관리**: 사용하지 않는 Provider 자동 정리

```dart
// 테스트에서 활용하는 예시
testWidgets('Todo 추가 테스트', (tester) async {
  await tester.pumpWidget(
    ProviderScope(
      overrides: [
        // 실제 Provider를 테스트용으로 교체
        todoListProvider.overrideWith(() => MockTodoNotifier()),
      ],
      child: TodoApp(),
    ),
  );
});
```

참고로 ProviderContainer를 통해서도 Provider를 통한 상태 관리를 할 수 있다.

> 💡 이번 TODO 앱에서는 `ProviderScope` 를 사용했다. 공식 문서에 따르면 Flutter 애플리케이션에서 `ProviderContianer`를 직접적으로 사용하는 건 지양해야 한다고 한다.
> 대신 다음과 같은 특수한 상황에서 유용하다고 한다:

- **테스트 환경**: 위젯 없이 provider 로직만 테스트할 때
- **백그라운드 서비스**: UI와 분리된 백그라운드 작업에서 상태 관리가 필요할 때
- **서버 사이드**: Dart 서버 애플리케이션에서 Riverpod을 사용할 때

#### 1-5 Ref 핵심 개념

Ref는 Provider와 Consumer를 연결하는 **다리** 역할을 한다. Widget에서 Provider의 데이터에 접근하거나 상태를 변경할 때 사용한다.

##### **Ref의 주요 메서드들**

```dart
class TodoPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 📡 ref.watch() - 상태 구독 (변화 감지)
    final todos = ref.watch(todoListProvider);

    // 🎯 ref.read() - 일회성 접근 (변화 감지 안함)
    final notifier = ref.read(todoListProvider.notifier);

    // 👂 ref.listen() - 상태 변화 감지해서 부수 효과 실행
    ref.listen(todoListProvider, (previous, next) {
      if (next.length > previous?.length) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('새 할 일이 추가되었어요!'))
        );
      }
    });

    return Column(
      children: [
        Text('할 일 ${todos.length}개'),
        ElevatedButton(
          onPressed: () => notifier.add('새 할 일'),
          child: Text('추가'),
        ),
      ],
    );
  }
}
```

##### Ref의 메서드 종류

| 메서드         | 용도        | 리빌드 여부    | 사용 예시             |
| -------------- | ----------- | -------------- | --------------------- |
| `ref.watch()`  | 데이터 표시 | ✅ 자동 리빌드 | UI에 상태 표시        |
| `ref.read()`   | 데이터 변경 | ❌ 리빌드 안함 | 버튼 클릭시 상태 변경 |
| `ref.listen()` | 부수 효과   | ❌ 리빌드 안함 | 알림, 네비게이션      |

#### 1-6 Consumer Widget 핵심 개념

Consumer Widget은 Provider의 데이터를 **구독**하고 **UI에 표시**하는 특별한 위젯이다. 일반 Widget과 달리 `WidgetRef ref` 매개변수를 통해 Provider에 접근할 수 있다.

```dart
// ❌ 일반 Widget - Provider 접근 불가
class NormalWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // final todos = ref.watch(todoListProvider);  // 💥 에러!
    return Text('Provider 접근 불가');
  }
}

// ✅ Consumer Widget - Provider 접근 가능!
class TodoCounter extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final todos = ref.watch(todoListProvider);  // ✨ 가능!
    return Text('할 일 ${todos.length}개');
  }
}
```

##### Todo 앱에서 Consumer Widget 활용 사례

Todo 앱에서는 주로 `ConsumerWidget`을 사용한다:

```dart
// 1. TodoList - Todo 목록을 표시하는 Widget
class TodoList extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final todos = ref.watch(todoListProvider);  // 👈 Todo 리스트 구독

    return ListView.builder(
      itemCount: todos.length,
      itemBuilder: (context, index) => TodoItem(todo: todos[index]),
    );
  }
}

// 2. TodoItem - 개별 Todo 항목을 표시하는 Widget
class TodoItem extends ConsumerWidget {
  final Todo todo;

  const TodoItem({required this.todo});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ListTile(
      leading: Checkbox(
        value: todo.isDone,
        onChanged: (_) => ref.read(todoListProvider.notifier).toggle(todo.id),
      ),
      title: Text(todo.title),
      trailing: IconButton(
        icon: Icon(Icons.delete),
        onPressed: () => ref.read(todoListProvider.notifier).remove(todo.id),
      ),
    );
  }
}
```

##### Consumer Widget의 역할

- 📡 `ref.watch()`로 상태를 **구독**하면 상태 변경시 자동으로 리빌드
- 🎯 `ref.read()`로 상태를 **변경**할 때는 리빌드되지 않음
- 🔄 Todo가 추가/삭제/수정되면 TodoList와 TodoItem이 자동으로 업데이트됨

#### 1-7 setState vs Riverpod 비교

**기존 setState 방식의 한계**

```dart
class _CounterPageState extends State<CounterPage> {
  int count = 0;  // 🚫 이 화면에서만 사용 가능

  void increment() {
    setState(() {
      count++;  // 🚫 이 Widget만 업데이트
    });
  }
}
```

**👿문제점**

- 다른 화면에서 `count` 값을 사용할 수 없음
- 데이터가 복잡해지면 관리가 어려움
- 부모에서 자식으로 데이터를 전달하려면 여러 단계를 거쳐야 함

##### Riverpod 방식

```dart
// 1️⃣ Provider 정의 (전역에서 접근 가능!)
final counterProvider = StateProvider<int>((ref) => 0);

// 2️⃣ Consumer Widget을 통한 값 구독
class CounterDisplay extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);  // 값 구독
    return Text('$count');
  }
}

// 3️⃣ 어디서든 값 변경 가능
class CounterButton extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ElevatedButton(
      onPressed: () => ref.read(counterProvider.notifier).state++,
      child: Text('증가'),
    );
  }
}
```

아래와 같은 장점이 있다.

- **전역 접근**: 어느 화면에서든 상태 사용 가능
- **자동 업데이트**: 상태 변경시 모든 구독자가 자동 업데이트
- **타입 안전성**: 컴파일 타임에 오류 검출
- **테스트 용이성**: Provider 교체로 쉬운 테스트

#### 1-8 설치 및 설정 방법

**패키지 설치 (권장 방법)**

```bash
# 메인 라이브러리 설치
flutter pub add flutter_riverpod

# 개발용 도구 설치 (코드 생성용)
flutter pub add --dev riverpod_generator build_runner
```

```dart
// main.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  runApp(
    ProviderScope(  // 👈 필수! 앱 전체를 감싸기
      child: MyApp(),
    ),
  );
}
```

이제 Riverpod의 4가지 핵심 개념을 모두 알아봤다! 다음 섹션에서는 실제 Todo 앱을 만들면서 이 개념들을 적용해보자.

## 2️⃣ Todo 앱 만들면서 Riverpod 적용하기

이제 실제로 Todo 앱을 만들면서 앞서 학습한 Riverpod의 4가지 핵심 개념을 모두 적용해보자!

**우리가 만들 Todo 앱의 기능:**

```python
- Todo 추가하기
- Todo 완료/미완료 토글하기
- Todo 삭제하기
- 완료된 Todo 개수 표시하기
```

#### 2-1 프로젝트 기본 설정

먼저 `main.dart`에서 **ProviderScope**로 앱을 감싸자:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app.dart';

void main() {
  runApp(
    const ProviderScope(  // 👈 핵심! Todo 앱의 모든 상태 관리 시작점
      child: App(),       //    이 안에서만 Provider 사용 가능하다
    ),
  );
}
```

> **💡 중요!** `ProviderScope` 없이는 `ref.watch()`, `ref.read()` 등을 사용할 수 없다. Todo 앱의 모든 기능이 이 ProviderScope 덕분에 작동한다!

#### 2-2 모델 정의

Todo가 어떤 정보를 가질지 정의해보자. `class`를 선언하자.
보다시피 Flutter가 기반으로 하는 Dart는 객체 지향 언이이다.

```dart
// models/todo.dart
class Todo {
  final String id;        // 고유 식별자
  final String title;     // 할 일 내용
  final bool isDone;      // 완료 여부

  const Todo({
    required this.id,
    required this.title,
    this.isDone = false  // 기본값은 미완료
  });

  // 불변성을 유지하면서 일부 값만 변경하는 메서드
  Todo copyWith({String? id, String? title, bool? isDone}) {
    return Todo(
      id: id ?? this.id,           // 새 값이 없으면 기존 값 사용
      title: title ?? this.title,
      isDone: isDone ?? this.isDone,
    );
  }
}
```

##### **왜 `copyWith`를 사용할까?**

Riverpod에서는 React와 마찬가지로 상태를 업데이트할 때 **불변성(Immutability)** 이 중요하다. 기존 객체를 직접 수정하지 않고, 새로운 객체를 만들어서 상태를 변경한다. 이렇게 해야 Riverpod이 변화를 감지하고 UI를 업데이트할 수 있다!

이건 React 해봤으면 익숙할듯

#### 2-3 `Notifier`로 상태관리하기

##### Notifier 핵심 개념

`Notifier`는 Riverpod에서 **복잡한 상태 로직을 관리하는 클래스**다. 단순한 값 하나만 관리하는 `StateProvider`와 달리, Notifier는:

- **비즈니스 로직을 캡슐화**할 수 있다
- **여러 개의 메서드**로 상태를 조작할 수 있다
- **상태 변화의 규칙**을 명확하게 정의할 수 있다

쉽게 말해서, Notifier는 **상태의 관리자(Controller)** 역할을 한다.

```dart
// 예시: 간단한 카운터 Notifier
class CounterNotifier extends Notifier<int> {
  @override
  int build() => 0;  // 초기값

  void increment() => state++;     // 증가
  void decrement() => state--;     // 감소
  void reset() => state = 0;       // 리셋
}
```

##### 상태 업데이트 메커니즘

Notifier에서 상태를 업데이트하는 과정은 다음과 같다:

1. **메서드 호출**: UI에서 `notifier.add()`같은 메서드를 호출
2. **상태 계산**: Notifier 내부에서 새로운 상태를 계산
3. **상태 할당**: `state = newValue`로 상태를 업데이트
4. **UI 자동 업데이트**: 이 Provider를 구독하는 모든 Widget이 자동으로 리빌드

```dart
// 상태 업데이트 흐름 예시
class TodoNotifier extends Notifier<List<Todo>> {
  void add(String title) {
    // 1. 새로운 Todo 객체 생성
    final newTodo = Todo(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
    );

    // 2. 기존 상태에 새 Todo 추가한 새 리스트 생성
    final newState = [...state, newTodo];

    // 3. 상태 업데이트 (이 순간 UI가 자동으로 업데이트됨!)
    state = newState;
  }
}
```

#### 2-4 TodoNotifier 구현

이제 Todo 리스트를 관리하는 **완전한 비즈니스 로직**을 만들어보자:

```dart
// providers/todo_providers.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/todo.dart';

class TodoNotifier extends Notifier<List<Todo>> {
  @override
  List<Todo> build() {
    // 초기 상태 - 빈 리스트로 시작
    return [];
  }

  // ✅ Todo 추가 로직
  void add(String title) {
    // 유효성 검사
    if (title.trim().isEmpty) return;

    final id = DateTime.now().millisecondsSinceEpoch.toString();
    final newTodo = Todo(id: id, title: title.trim());

    // 불변성을 유지하며 새 상태 생성
    state = [...state, newTodo];
    // 👆 이 순간 TodoList Widget이 자동으로 리빌드됨!
  }

  // ✅ Todo 완료/미완료 토글 로직
  void toggle(String id) {
    state = [
      for (final todo in state)
        if (todo.id == id)
          todo.copyWith(isDone: !todo.isDone)  // 특정 Todo만 상태 변경
        else
          todo,  // 나머지는 그대로 유지
    ];
    // 👆 체크박스가 자동으로 업데이트됨!
  }

  // ✅ Todo 삭제 로직
  void remove(String id) {
    state = state.where((todo) => todo.id != id).toList();
    // 👆 해당 TodoItem이 화면에서 자동으로 사라짐!
  }

  // 🔍 추가 기능: 완료된 Todo 개수 계산
  int get completedCount => state.where((todo) => todo.isDone).length;

  // 🔍 추가 기능: 전체 완료 토글
  void toggleAll() {
    final allCompleted = state.every((todo) => todo.isDone);
    state = [
      for (final todo in state)
        todo.copyWith(isDone: !allCompleted)
    ];
  }
}
```

**핵심 포인트:**

- ⭐️ `build()`: 초기 상태를 정의 (한 번만 실행됨)
- `state = newValue`: 상태 업데이트, 이 순간 UI가 리빌드됨
- **불변성**: 기존 객체를 수정하지 않고 새 객체/리스트를 생성
- **유효성 검사**: 비즈니스 로직을 Notifier에 캡슐화

#### 2-5 UI 반영 과정

```dart
// 1. 사용자가 버튼 클릭
ElevatedButton(
  onPressed: () {
    // 2. Notifier 메서드 호출
    ref.read(todoListProvider.notifier).add('새 할 일');
  },
  child: Text('추가'),
)

// 3. TodoNotifier.add() 실행
void add(String title) {
  state = [...state, Todo(id: '1', title: title)];  // 상태 변경!
}

// 4. TodoList Widget이 자동으로 리빌드
class TodoList extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final todos = ref.watch(todoListProvider);  // 👈 새 상태를 자동으로 받음!

    return ListView.builder(
      itemCount: todos.length,  // 👈 개수가 자동으로 업데이트됨!
      itemBuilder: (_, i) => TodoItem(todo: todos[i]),
    );
  }
}
```

#### 2-6 Provider 연결

이제 UI에서 사용할 수 있도록 Provider를 만든다:

```dart
// providers/todo_providers.dart 파일에 추가
final todoListProvider = NotifierProvider<TodoNotifier, List<Todo>>(
  TodoNotifier.new,  // TodoNotifier 생성자를 간단히 전달
);
```

이제 `todoListProvider`를 통해 어디서든 Todo 리스트에 접근할 수 있다!

**Provider 연결의 핵심:**

- `NotifierProvider<Notifier클래스, 상태타입>`: Notifier를 Provider로 등록
- `TodoNotifier.new`: 클래스의 생성자를 전달
  이렇게 하면 어느 Widget에서든 이 Provider를 사용할 수 있다.

##### ref.watch vs ref.read

**이 둘의 차이점을 명확히 알아야 한다!**

**`ref.watch` - 상태 구독 👀**

```dart
final todos = ref.watch(todoListProvider);
// todos가 변하면 이 Widget이 다시 그려진다!
```

**`ref.read` - 일회성 접근 🎯**

```dart
final notifier = ref.read(todoListProvider.notifier);
notifier.add('새 할 일');
// 값만 읽거나 메서드를 호출할 때 사용, Widget은 다시 그려지지 않음
```

**언제 뭘 사용할까?**

- **`ref.watch`**: UI에 데이터를 표시할 때
- **`ref.read`**: 버튼을 눌렀을 때 상태를 변경할 때

**실제 사용 예시:**

```dart
class TodoPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 🔍 상태 읽기 - UI가 상태 변화를 구독
    final todos = ref.watch(todoListProvider);
    final completedCount = ref.read(todoListProvider.notifier).completedCount;

    return Column(
      children: [
        Text('총 ${todos.length}개, 완료 ${completedCount}개'),

        ElevatedButton(
          onPressed: () {
            // ✏️ 상태 변경 - 메서드 호출
            ref.read(todoListProvider.notifier).add('새 할 일');
          },
          child: Text('Todo 추가'),
        ),

        // 📋 Todo 리스트 표시
        Expanded(
          child: ListView.builder(
            itemCount: todos.length,
            itemBuilder: (context, index) {
              final todo = todos[index];
              return ListTile(
                title: Text(todo.title),
                leading: Checkbox(
                  value: todo.isDone,
                  onChanged: (_) {
                    // ✏️ 개별 Todo 상태 변경
                    ref.read(todoListProvider.notifier).toggle(todo.id);
                  },
                ),
                trailing: IconButton(
                  icon: Icon(Icons.delete),
                  onPressed: () {
                    // ✏️ Todo 삭제
                    ref.read(todoListProvider.notifier).remove(todo.id);
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
```

⭐️ **핵심:** 상태 반영이 이루어져야 될 때만 `ref.watch`를 사용하자!

##### React useReducer와의 비교

React에서는 `useReducer`를 사용해봤다면, `reducer` 함수 내에서 상태 업데이트 로직을 구현하고, `dispatch` 함수에 action을 전달하여 실제 상태를 업데이트하는 거에 익숙할 것이다.

<br/>

**useReducer 사용패턴**

```javascript
// reducer 함수
function todoReducer(){
    switch (action){
        case "add":
            ...
        case "subtract"
            ...
    }
}

const [todos, dispatch] = useReducer(todoReducer, [])

// dispatch 함수를 통해 action 전달하여 상태 업데이트
dispatch({ type: "ADD_TODO", payload: { title: "New Todo" } })
dispatch({ type: "TOGGLE_TODO", payload: { id: "1" } })
```

**Riverpod Notifier**

```dart
final todos = ref.watch(todoListProvider);
final notifier = ref.read(todoListProvider.notifier);

// 메서드 직접 호출 (더 직관적!)
notifier.add('New Todo');
notifier.toggle('1');
```

reducer함수처럼, flutter에서 Nofitifer 내에 상태 업데이트 로직을 구현하고
실제 상태를 업데이트하는 로직을 전달할 때는 `ref.watch` or `ref.read` 로 Notifier를 구독한 뒤 Notifier의 값(현재 상태)이나 메서드를 불러올 수 있다.

### 애플리케이션 로직 구현

#### 2-7 Todo 추가 기능

메인 화면에서 새로운 Todo를 추가하는 로직:

```dart
// views/todo_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:todo/providers/todo_providers.dart';
import 'widgets/todo_list.dart';

class TodoPage extends ConsumerStatefulWidget {  // 👈 StatefulWidget + Consumer
  const TodoPage({super.key});

  @override
  ConsumerState<TodoPage> createState() => _TodoPageState();
}

class _TodoPageState extends ConsumerState<TodoPage> {
  final _controller = TextEditingController();

  void _submit() {
    final text = _controller.text.trim();
    if (text.isNotEmpty) {
      ref.read(todoListProvider.notifier).add(text);  // 👈 Todo 추가
      _controller.clear();  // 입력 필드 비우기
    }
  }

  @override
  void dispose() {
    _controller.dispose();  // 메모리 누수 방지
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('📋 Todo 리스트')),
      body: Column(
        children: [
          // 입력 부분
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    onSubmitted: (_) => _submit(),  // 엔터 키로도 추가 가능
                    decoration: const InputDecoration(
                      hintText: '할 일을 입력하세요',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton(
                  onPressed: _submit,
                  child: const Text('추가')
                ),
              ],
            ),
          ),
          // Todo 리스트
          const Expanded(child: TodoList()),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _submit,
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

#### 2-8 Todo 삭제 및 토글 기능

개별 Todo 아이템의 UI와 상호작용:

```dart
// views/widgets/todo_item.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:todo/models/todo.dart';
import 'package:todo/providers/todo_providers.dart';

class TodoItem extends ConsumerWidget {
  final Todo todo;

  const TodoItem({super.key, required this.todo});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ListTile(
      // 체크박스
      leading: Checkbox(
        value: todo.isDone,
        onChanged: (_) => ref.read(todoListProvider.notifier).toggle(todo.id),
      ),
      // 할 일 내용
      title: Text(
        todo.title,
        style: TextStyle(
          decoration: todo.isDone
            ? TextDecoration.lineThrough  // 완료된 항목은 취소선
            : null,
        ),
      ),
      // 삭제 버튼
      trailing: IconButton(
        icon: const Icon(Icons.delete),
        onPressed: () => ref.read(todoListProvider.notifier).remove(todo.id),
      ),
    );
  }
}
```

## 3️⃣ ⭐️ Best Practice 정리

#### 3-1. Provider 네이밍 규칙

```dart
// ✅ 좋은 예 - Provider임을 명확히 표시
final userProvider = Provider<User>(...);
final todoListProvider = NotifierProvider<TodoNotifier, List<Todo>>(...);

// ❌ 나쁜 예 - 무엇인지 알기 어려움
final user = Provider<User>(...);
final todos = NotifierProvider<TodoNotifier, List<Todo>>(...);
```

#### 3-2. 상태와 UI 분리

```dart
// ✅ 좋은 예 - 비즈니스 로직을 Notifier에 캡슐화
class TodoNotifier extends Notifier<List<Todo>> {
  void addTodo(String title) {
    if (title.trim().length < 3) {
      // 유효성 검사 로직도 여기에!
      return;
    }
    // 추가 로직...
  }
}

// ❌ 나쁜 예 - Widget에서 직접 상태 조작
ElevatedButton(
  onPressed: () {
    ref.read(provider.notifier).state = [...state, newTodo];  // 😱
  },
);
```

#### 3-3. 적절한 Provider 타입 선택

```dart
// 간단한 값일 때
final counterProvider = StateProvider<int>((ref) => 0);

// 복잡한 객체나 비즈니스 로직이 있을 때
final todoListProvider = NotifierProvider<TodoNotifier, List<Todo>>(
  TodoNotifier.new
);

// 비동기 작업이 있을 때
final weatherProvider = FutureProvider<Weather>((ref) async {
  return await weatherApi.getCurrentWeather();
});
```

#### 3-4. 에러 처리

```dart
// AsyncNotifier를 사용한 에러 처리
final todosProvider = AsyncNotifierProvider<TodosNotifier, List<Todo>>(
  TodosNotifier.new,
);

// UI에서 에러 상태 처리
final todosAsync = ref.watch(todosProvider);

return todosAsync.when(
  data: (todos) => TodoList(todos),
  loading: () => const CircularProgressIndicator(),
  error: (error, stack) => Text('오류가 발생했어요: $error'),
);
```

#### 3-5. 테스트하기 쉬운 구조

```dart
// Provider를 가짜 구현으로 교체하여 테스트
testWidgets('Todo 추가 테스트', (tester) async {
  await tester.pumpWidget(
    ProviderScope(
      overrides: [
        todoListProvider.overrideWith(() => MockTodoNotifier()),
      ],
      child: MyApp(),
    ),
  );

  // 테스트 로직...
});
```

## 4️⃣ 마무리 🎉

#### Riverpod을 언제 사용해야 할까? 🤔

이번 Todo 앱을 만들면서 Riverpod을 사용해보니, 다음과 같은 상황에서 특히 유용하다고 느꼈다:

**✅ Riverpod을 사용하면 좋은 경우:**

- **여러 화면에서 같은 데이터를 공유**해야 할 때 (로그인 정보, 장바구니 등)
- **복잡한 비즈니스 로직**이 있을 때 (Todo 추가/수정/삭제 등)
- **테스트가 중요한 프로젝트**일 때 (Provider 교체로 쉬운 테스트)
- **타입 안전성**이 중요할 때 (컴파일 타임 오류 검출)

**❌ 굳이 Riverpod까지 필요 없는 경우:**

- 단순한 UI 상태만 관리하는 경우 (`setState`로 충분)
- 한 화면에서만 사용하는 데이터인 경우
- 프로젝트 규모가 매우 작은 경우

### 큰 관점에서 배운 점 📚

#### 1. **상태 관리의 본질**

Riverpod을 통해 상태 관리의 핵심은 "누가, 언제, 어떻게 데이터를 관리할 것인가"라는 것을 깨달았다. React의 상태 관리와 비슷하지만, Flutter의 Widget 생명주기와 더 자연스럽게 통합된다는 점이 인상적이었다.

#### 2. **선언적 UI의 힘**

```dart
// 상태가 변하면 UI가 자동으로 업데이트됨
final todos = ref.watch(todoListProvider);  // 이것만으로 끝!
```

상태가 변하면 자동으로 UI가 업데이트되는 **선언적 패러다임**이 얼마나 강력한지 체감했다. 개발자는 "무엇을 보여줄 것인가"에만 집중하면 된다.

#### 3. **불변성의 중요성**

```dart
// ❌ 기존 객체 수정
state[0].isDone = true;

// ✅ 새 객체 생성
state = state.map((todo) =>
  todo.id == id ? todo.copyWith(isDone: true) : todo
).toList();
```

React와 마찬가지로 **불변성을 유지**해야 상태 변화를 정확히 감지할 수 있다는 것을 다시 한번 확인했다.

#### 4. **관심사의 분리**

- **Model**: 데이터 구조 정의 (`Todo` 클래스)
- **Notifier**: 비즈니스 로직 (`TodoNotifier`)
- **Provider**: 상태 제공 (`todoListProvider`)
- **Consumer**: UI 렌더링 (`TodoList`, `TodoItem`)

### React 개발자 관점에서의 Riverpod 💭

React에서 Redux나 Zustand를 사용해본 경험이 있다면, Riverpod의 접근 방식이 매우 친숙하게 느껴질 것이다:

| React 생태계  | Flutter Riverpod    | 공통점      |
| ------------- | ------------------- | ----------- |
| `useSelector` | ref.watch()         | 상태 구독   |
| `dispatch`    | ref.read().method() | 상태 변경   |
| `Provider`    | ProviderScope       | 상태 제공자 |
| `useEffect`   | ref.listen()        | 부수 효과   |

### 결론

Riverpod은 처음에는 복잡해 보일 수 있지만, 본질적으로 React의 상태 관리와 크게 다르지 않다.
