+++
title = "CSC 216: Intro to Software Engineering & Programming Concepts"
[extra]
teacher = "Dr. Sarah Heckman"
+++

# Administrivia

## Grades

| Weight          | Component       | Additional Info                                                                   |
|-----------------|-----------------|-----------------------------------------------------------------------------------|
| 12%             | Guided Projects |                                                                                   |
| 34%             | Projects        | Two projects. 3% of each is part 1. 14% of each is part 2.                        |
| Guided Projects | 12              |                                                                                   |
| Labs            | 15              |                                                                                   |
| Exam 1          | 12              | Exam 1 will cover material from approximately the first third of the course.      |
| Exam 2          | 12              | Exam 2 will cover material from approximately the first two-thirds of the course. |
| Exam 3          | 15              | Exam 3 will cover all materials for the course.                                   |

* Need >65% on exams to get a C or higher

## Lecture

* Attendance: You must answer at least one of the Google form exercises per
  class.
  * If miss 4+ labs, -5 pt on final grade.
* Instructor: Dr. Sarah Heckman (sesmith5)
* Email: sarah_heckman@ncsu.edu
* Web Page: <https://people.engr.ncsu.edu/sesmith5/>
* Phone: 919-515-2042
* Office Location: Engineering Building II, Room 2297
* Office Hours: (See calendar for most up-to-date office hours)

## Lab

* Name: Hanna Fernandez
* Email: hfernan@ncsu.edu
* Jenkins: go.ncsu.edu/jenkins-csc216-2
* Attendance: Required.
  * Missing 4 labs will result in F
* A lab grade may be dropped.

## Assignments

* Projects:
  * Part 1: Design and black-box testing. Independent.
  * Part 2: Implementation and testing. Optionally independent.
* Guided Projects:
  * There will be 3.
  * All independent.

## Academic Integrity

* We follow the [ACM Code of Ethics and Professionalism](https://www.acm.org/code-of-ethics)
* All work must be own.
* Cheating results in -100 for assignment.
* TA's are "Peer Teaching Fellows"

## Main Topics

* Managing Complex Software: Software gets big. How do you handle it?
  * Tools: Eclipse :(
* Test Driven Development: Writing tests first and then trying to make it so
  that your code passes those tests.
  * Tools: JUnit 4
* Code Coverage: How much code is being tested
* Static Analysis: Looks at the code itself.
  * Tools: Checkstyle, SpotBugs, PMD, EclEmma
* Version Control: Manages source code across machines and tracks and merges
  changes.
  * Tools: Git
* Continuous Integration: Whenever there is a change in the repository, test the
  code.
  * Tools: Jenkins

# Object Oriented Design (OO)

*N.B. These are defined with reference to Java.*

* Procedural: Execute code without objects. Everything is simply a list of
  of things to run (i.e. a procedure!).
* Object Oriented: We deal with objects, representations of real things,
  which can interact with other objects and classes in limited, controlled ways.
* Method: A list of statements to run.
  * Static: A method which isn't connected to an object.
  * Non-static: A method which is connected to an object.
* Class: A blueprint for an object. Has a list of methods and fields that
  each object should have, and it defines what each of those methods do
  (normally) and what type those fields are.
* Object: An instance of a class. Takes up space in memory (well, most
  objects are really just *reference* objects) which defines the fields. It can
  leverage the methods it has given to it by the class to do stuff with its
  fields.
* Reference Objects / Pointers: A much, much smaller bit of information
  that simply points to a place in memory. When you "copy" objects normally in
  Java, it just copies the reference object / the pointer

## FAQ

* *Why use abstract classes and interfaces?* To promote code reuse and make
  sure that methods can be interacted with in a standard way. Abstract classes
  **promise** that there will be some functionality.
* *Why make the distinction?* Because, in Java, you can only `extend` a single
  class but you can `implement` as many interfaces as you want.
* *How do you Javadoc abstract methods?* Provide high-level guidance to what
  functionality is expected from this method.
* *How do you Javadoc interfaces?* Provide similar comments like abstract
  classes, but even better because they are so broad.
* *Why use interfaces if you're just going to use it once?* (A) It makes more
  sense. (B) It makes it easier for you to add more things in the future. (C)
  You might not be the only one who wants to use something like that.
* *Can you cast a parent to a child?* Nope! Well, technically, yes but only if
  the child doesn't add anything on top of the parent. **But, all children add
  at least a pointer to the parent.**

## Vocabulary

* Single Inheritance: A class can only inherit a single class or have a single parent.
  * *Why?* To prevent name space clashing (although this does have other solutions).
* Polymorphism: Where you can treat multiple different types (of objects) as
  the same type.
  * This is normally visualized, in Java, as a hierarchy of classes, like a
  family tree.
* Abstract Class: Classes that can have `abstract` methods.
  * Concrete children `extends` this abstract class but can only implement one.
  * **Consider nouns.**
* Abstract Method: An exposed method in an abstract class (since it must be
* implemented in a child).
* Interfaces: Special classes that only describe abstract methods.
  * Concrete children `implements` this interface and can implement many.
  * All classes are `public` and `abstract` (because nothing else matters to
  outsiders).
* Abstract classes and interfaces cannot be instantiated.
  * Abstract classes can specify constructors, however.
* Delegation: The process of wrapping an Object so that it uses the Object's
  behaviors as its behaviors.

## Methods

* Methods have a signature, which is their name and parameter types.
* Parameters have a type and can be `final`.
* Syntax: `accessMod [static] ReturnType name([final] Type param1, [final] Type param2)`

## Semantics

* Value Semantics: This bit of data is dealt with directly. That is its
  actual information in memory.
* Reference Semantics: This bit of data is interacted with by a reference
  object / pointer.
* Dereferencing: Accessing the data or the method of an object.
  * Dot Notation: The process of accessing the methods of a reference.
    * e.g. `reference.method()`, `reference.field`

### Null Semantics

* `null`: A built in value that does not refer to any object.
  * It cannot be dereferenced!
* `null` can be passed, initialized, checked for, returned (for bad data), etc!

### Java Specifics/Oddities

* Java uses *reference semantics* for all objects and *value semantics* for all
  primitives.
* Implicit Parameter: `this` is an implied parameter in all methods of an
  object. It references the current object.
* Default Values: All types have specific default values.
  * `int` = 0
  * `double` = 0.0
  * `boolean` = false
  * `char` = null (character)
  * `Object` = null (object)

### Invariants

* Invariants: Things which you state are going to be always true. You must
  ensure it.
  * *Java Invariants:* If you override `equals()`, you should also override
  `hashCode()`
  * `hashCode()`: Hashes an objects

### Cloning

* `.clone()`: Returns a shallow copy of a given object. *This comes from `interface Cloneable`*
* *What about deep copies?*

## Composition and Delegation

* Composition: A class has fields that are instances of other class(es).
* Delegation: The course can call upon methods and other things of the
  objects it contains. Allows an object to not get too complex!
* Abstraction: The process of separating ideas so you don't have to know
  everything! This is the beauty of OOD.
* Encapsulation: Hide the plumbing or implementation details from the
  clients. They don't need to know and they might mess things up!
  * Ways: Make fields private so you can control what people do.

## Inheritance

* Hierarchical. Allows *specialization* of broader class.
* The super class (parent) is ignorant of the sub class (child)
* Super class constructed first. That means that the sub class can override parts of the super
  class and a sub class has a pointer to its parent.
* The sub class is an *instance of* the super class.
* A child cannot modify the `private` variables of its parent.
  * However, it can modify `protected` variables. (But those are yuck!)
* Everything in a hierarchy should define its own equals methods. Then, the child checks the
  parent's equality and then checks its specialization.

### Java Syntax

* `extends`: Shows parent/superclass of child/subclass
* `super`: References the parent/superclass of the current class.
* A class can only extend one class.

```java
public class SubClass extends SuperClass {
  // This class has all of the (implemented)
  // functionality of the super class
}
```

### Usage

* Children are *clients* of the parent and must use accessor/mutator methods to
  modify those fields.
* A child can act as its parent. *A parent can not act like its child.*
* If a child is acting as a parent, you cannot reference any of the child's
  (childish) things.

## Abstract Class

* If you use interfaces or abstract classes to interact with someting, you can *only* interact
  with the methods present in those interfaces or abstract classes.

```java
public abstract class Beer
implements Drinkable, Brewable {

  private String name;

  public Beer(String name) {
    this.name = name;
  }

  // Declare abstract methods
  public abstract boolean
  addIngredient(BeerIngredient i);
  public abstract Collection<BeerIngredient>
  getIngredients();

  // Implement inherited methods
  public void brew() {
    System.out.println(
      name + " is being brewed"
    );
  }

  // I don't have to implement Drinkable because
  // this is an abstract class
}
```

## Interface

```java
public interface Brewable {
  void brew();
}
```

## Nested Classes

* Outer Class: A class that contains an inner class.
* Inner Class: A class defined within another class.
* Compiled Bytecode Class Names: `OuterClass$InnerClass.class`
* In UML Diagrams:
  * Composition connector (black diamond)
  * Inner-class connector (white circle with black x)
* Static Nested Class: A `static` class inside of an outer class.
  * These can *only* access the outer class's instance values.
* To access parent outer explicitly use `OuterClass.this`.
* To access public inner class, use `OuterClass.InnerClass`.

### Advantages

* Encapsulation: Clients don't have to worry about them (if they're private)
* Inner classes can change the instance fields of their outer class.
  * *It cannot access the nested classes fields!*

## Anonymous Objects

* Anonymous Object: An object that is created with no reference to it.

## Anonymous Classes

* Anonymous Classes: Creating a class in-line. A class that has no real name
  * Mostly used when creating an interface that implements some methods.

```java
new Foo() {
  public int someState;
  public void doStuff() {
    // Do things
  }
}
```

## Exceptions

* Exception: A special object that represents an error or bad condition.
  * Unchecked Exception: Exception that doesn't have to be handled to be compiled.
  * Java Examples: `InputMismatchException`
  * For Java: extend `RuntimeException`
  * Checked Exception: Exception that must be handled to be compiled.
  * Java Examples: `FileNotFoundException`
  * For Java: extend `Exception`
  * Checked vs Unchecked is semi-arbitrarily decided by Java language developers.
* `throw`: A keyword that throws an object that implements the `Throwable` interface.
* `throws`: A keyword in the method header that states that the stated exception might be generated

### Try-Catch-Finally Blocks

* Try: Statements that might throw exception.
  * Mandatory block.
* Catch: Statements that handle exception.
  * Mandatory block.
* Finally: Statements that always execute. Good place for closing resources.
  * Optional block.
* Normal Flow: Specific exception, less specific exception, general exception
* Multi-catch: Can catch a list of exceptions in a common catch block.
  * For Java 1.7+
* Try-with-Resources: Declares one or more resources that must be closed. Essentially automatically
  closes resources when necessary. (Opened resources must implement `Autoclosable`)
  * Alternative to try.
  * For Java 1.7+

```java
try {
  // Do things
} catch (ExceptionType name) {
  // Handle errors
}
```

```java
try {
  // Statements
  // Exception thrown!
  // Statements skipped
} catch (UnmatchedExceptionType name) {
  // Would handle exception, but doesn't go in
  // here
} catch (MatchedExceptionType name) {
  // Handle thrown exception
} catch (AlsoMatchedExceptionType name) {
  // Would handle exception, but goes to first
  // catch block.
} finally {
  // Statements here are always executed!
}
```

```java
try {
  // Throws either Exception1 or Exception2,
  // that need to be handled equally
} catch (Exception1 | Exception2 name) {
  // Handle exceptions
}
```

```java
try (File f = new File()) {
  // May throw FileNotFoundException
} catch (FileNotFoundException e) {
  // Handle exception
}
// Resources automatically closed!
```

### Create Custom Exceptions

* Don't go too crazy. They're generally not a very good idea.
  * If you can use a common Java exception, do!
* Useful if you want to add more information or have a specific Exception that is not present in the
  Java exceptions library.

```java
public class MyException extends Exception {
  public MyException(String message) {
    super(message);
  }
  public MyException() {
    super("Exception message");
  }
}
```

## Errors

* You rarely need to create errors.
* Errors are fatal issues that are rarely encountered and should (almost) *never* be caught.
  * Java Examples: `OutOfMemoryError`

# (Java) Libraries

* Libraries: A reusable collection of classes and pieces of software. *Promotes
  code reuse, standard ways of doing things, efficient code, and focusing on
  what is really important for your project.*
  * Examples: Java, Java Collections, JUnit, Apache
  * "It's a solved problem."
* API: A list of instructions of how to interact with the software.
  * For this class, they are simple a series of webpages, created from Javadoc,
  that describe how to use our afternoon.
* Installation of Libraries:
  * Add the JAR (Java ARchive) to your classpath.
* Classpath: A set of locations that your Java Compiler and JVM will look at for code.
  * By default, your system `PATH` variable. However, you can update it with command line flags.
  * Eclipse does this automatically with your `.project` and `.classpath` files. This allows you to
  structure your projects like Eclipse expects and compile them easily within Eclipse.
  * In Eclipse, you add libraries to the build path on a per-project or a global scale.

## Library and Build Managers

* Maven: Helps manage projects and libraries. Helps build.
* Gradle: Like maven but different.
* Ant: Helps manage projects and libraries.

## Java Iterators

Java collections can be iterated using a for-each loop.

```java
for (Type item : container) {
  // Do things
}
```

This allows for more effiecient code, as you don't always have to pass through things multiple
times. Instead, you can use an iterator which keeps track of its position and its value.

To make a class use iterators, you should implement `Iterable<E>`.

```java
public class List<E> implements Iterable<E> {
  // Stuff
  public Iterator iterator() {
    // Make iterator and stuff
  }
  public class Iterator<E> {
    // Do stuff
  }
}
```

### API

* `hastNext() : boolean`: Returns true if the Iterator can return another element.
* `next() : E`: Returns the value of the next element. (This is also the thing
  the Iterator is currently on.)
* `remove()`: Removes the current element under the Iterator.

## Limitations

* Iterator is unidirectional.
* Adding things while Iterating causes issues. (`ConcurrentModificationException`)

## Misc

* Iterators keep track of their spots even if you remove stuff. *If properly implemented.*

## Java GUIs

* Java GUI Libraries:
  * `java.awt.*`: Abstract Windowing Toolkit. The OG.
  * `javax.swing.*`: Java Extension Swing
  * Inherits from `awt`.
* Components:
  * Frame: Top-level window with title and border.
  * Container: A thing that contains components.
  * Panel: A thing that can hold other components or panels.
  * Components: A thing that does a thing (e.g. buttons, text boxes).
  * Top-level containers: `JFrame`, `JDialog`, `JApplet`
  * General-purpose containers: `JPanel`, `JScrollPane`
  * Special-purpose containers: `JRootPane`, `JLayeredPane`
* Layouts:
  * `BorderLayout`: The UI is divided into north, sound, east, west, and
  center.
  * `FlowLayout`: Components go from left to right and wrap when they run out
  of room.
  * `BoxLayout`: Components in row or column.
  * `CardLayout`: Components in a stack where only the top is shown.
  * `GridLayout`: Things are in a rectangular grid.
  * `GridBagLayout`: Things are in a rectangular grid and can span multiple
  grids.

GUIs are **event-driven**. That is, we wait for the user to interact with the
GUI and they can do whatever they want. We can, however, restrict their access.

This means, even close buttons, don't truly close the program.

To create a GUI, try storyboarding and consider what your user needs to do.
Draw a picture of your planned GUI and adjust it as you think about what a user
must do with it. Try sectioning things off into logical blocks or creating a
tree of components.

Generally, thinking about things as columns and rows is very helpful.

Java uses the **event model** to handle events in GUIs. This uses **event
objects** that encapsulate the information required to handle the event; this
includes the information entered, the type of action, and the source of the
event (e.g. a button).

An event model uses **events**, **handlers**, and **listeners**. Events are
things that the user has done or things that have occurred. Handlers are things
that notify listeners when events have occurred. Listeners are things that take
action given certain events. In Java, the event is an `EventObject` and a
listener is an `EventHandler`. Because of this structure, we must register listeners to the handler.

To create listeners, you create an object that implements `ActionListener`.
There are many ways to do this:
* You could make your GUI implement `ActionListener` and then create a broad
  `eventPerformed(ActionEvent)` method that handles all events performed, using
  if statements.
  * Pros: Separates controller and view code.
  * Cons: God it's so fucking gross.
* Create named `ActionListener` classes.
  * Pros: You can reuse code so much.
  * Cons: You have to write a ton of boilerplate and go across multiple classes.
* Create anonymous `ActionListener`s with their specific code.
  * Pros: You don't get gross spaghetti code with tons of if statements.
  * Cons: It mixes controller and view code. It is harder to reuse things.
* Create lambda expressions for handling events.
  * Pros: You don't have to write as much boilerplate as the anonymous class.
  You can also reuse some code.
  * Cons: It doesn't separate the controller and view code as much.

**Low level events** are interactions with the operating system, like key
pressed. **Semantic events** are user-actions, like button clicks and text
edits.

To handle low level events, it is recommended to use Java's `*Adapter` abstract
classes. These make it easier to handle low level events and "convert" them to
action events.

* `JButton`:
  * `.processEvent()`: Takes in `ActionEvent` and takes action.

```java
public class CSC216GUI extends JFrame
implements ActionListener {

  public CSC216GUI() {
    // Setup
    setTitle("CSC 216 GUI");
    setSize(400, 400);
    setLocation(600, 200);

    // Create main container
    Container c = getContentPane(
      new BorderLayout()
    );

    // Components
    JLabel lblCheer = new JLabel("Wolf!");
    c.add(lblCheer, BorderLayout.NORTH);

    JButton btnClick = new JButton("Click me!");
    // Anonymous class
    btnClick.addActionListener(
      new ActionListener() {
        void eventPerformed(ActionEvent e) {
          System.out.println("Anonymous class");
        }
      }
    );
    // Lamda expression
    btnClick.addActionListener(e -> {
      System.out.println("Lambda expression")
    });
    // GUI is listener
    btnClick.addActionListener(this);
    c.add(btnClick, BorderLayout.SOUTH);

    // so it actually closes
    setDefaultCloseOperation(EXIT_ON_CLOSE);
    // default is invisible :)
    setVisible(true);
  }

  public void eventPerformed(ActionEvent e) {
    System.out.println("GUI is listener");
  }

  public static void main(String[] args) {
    CSC216 gui = new CSC216GUI();
  }

}
```

## ListIterator

A List specifically for lists. All linked lists are *doubly linked lists.* To
support inserting in doubly linked lists, you need to make the first and last
node actual nodes and not names for the boundary nodes (like what I said when I
created `Walker`). ListIterator's think about being *between* two nodes.

* Differences:
  * Can move forward and backward through the list (doubly linked).
  * Sits between two elements.
  * Can handle concurrent adding.

### ListIterator API

* `hasNext() : boolean`: Returns true if the ListIterator can return the next element.
* `next() : E`: Returns the next element.
* `nextIndex() : boolean`: Returns the index of the next element.
* `hasPrevious() : boolean`: Returns true if the ListIterator can return the previous element.
* `previous() : E`: Returns the previous element.
* `previousIndex() : boolean`: Returns the index of the previous element.
* `add(E)`: Inserts the specific element between the two elements the `ListIterator` is currently
  at.
* `remove()`: Removes the element last returned by `next()` or `previous()`.
* `set(E)`: Replaces the last element returned by `next()` or `previous()` using the given data.

### AbstractSequentialList

`AbstractSequentialList` is an abstract class is useful for creating lists.
This implements almost everything except for `listIterator()` and `size()`
because everything is done through `ListIterator`.

# Design Patterns

* Design Pattern: A standard way to solve a specific problem
  * "It's a solved problem!"
  * Why? Because they help communication
* Design patterns *emerge*.
* Common Ones: Written by "The Gang of Four" and there are 23 written in a big book.

## Families

* Creational: Process of object creation.
* Structural: Composition of classes or objects.
* Behavioral: Ways in which classes interact and distribute responsibility.
* Concurrency: How to make code that is thread-safe and can run at the same
  time without breaking.

## Model-View-Controller (MVC)

* *What does it do?* Separates the presentation of info from the working with
  the info.
* *Why?*
  * You can hotplug the view and/or controller really easily!
  * You can debug issues more easily because you know what is failing.
* Model: Contains data and the logic for maintaining that data.
* View: Displays things to the user.
* Controller: Handles and translates the data of the model for the view or
* others.
* Examples:
  * Java Swing Apps:
  * View and controller in the same class (very tightly coupled). (GUI class)
  * Web Apps:
  * View: HTML/XHTML + CSS.
  * Controller: GET and POST.
  * Model: Whatever backend underlies the project.

## Observer

You have a single object that you want to be able to notify any number of other
objects about when it changes.

To do this, you make the single object you want to have other things observe
extend `Observable`, which means it knows how to handle adding observers and
notifiers. Then you have your observers extend `Observer`, which means they
know how to handle being notified by an observable object.

*Why would you do this?* It allows you to decouple the thing your objects want
to watch, meaning that it doesn't have to know about its listeners. This allows
you to make easier to refactor to the higher level observers without breaking
the observable.

This is commonly done in GUIs.

```java
// In the Observable when something changes
this.setChanged();
notify();
```

## Singleton

A class controls the number of instances and the manner of creation of its
instances.

Here, we will only ever use a singleton that manages *one* instance of itself.

*Why do this?* So outsiders only look at a single instance or controlled
instance by the class.

## State Pattern

A way to implement [FSMs](#finite-state-machines) with objects.

Essentially, you have a state object representing each state. The machine
parses the input and calls the appropriate method on the current state object.
That state object then acts and changes the parent state object as necessary.

# Design Suggestions

* Don't implement functionality you don't know the clear use of.
* Don't implement any functionality if its not in the requirements.
  * *You should update the requirements, not implement what isn't there!*
* Limit class mutability as much as possible.
  * Omit mutators that have no use.
  * Limit object creation to the constructor.
* Classes should be as cohesive as possible. *They are a single level of abstraction*
  * Should this class/object really know this?
* Limit coupling. Make classes orthogonal
* Design documents are *persuasive* papers.
* Don't create a bunch of objects. It's inefficient.
* Changing things is *dangerous*. Adding things is less.
* Duplicating works is dumb.
  * One reason OO is useful.

# Software Engineering & Design

## Methods of Showing Design

* UML (Unified Modeling Language) Diagram: Shows the interaction between different classes and
  objects.
* CRC (Class, Responsibilities, Collaborators): Shows, on a per class basis, what each Object does
  and is responsible for.
  * Responsibilities: Behaviors
  * Collaborators: State, interacting classes

* Software Design Models: A generalized approach to creating some piece of software.
  * Waterfall
  * Spiral
  * Iterative (Agile!)
* Software Process Development Phases
  1. Requirements/Analysis
  2. Design
  3. Implementation/Code
  4. Testing
  5. Integration
  6. Maintenance
* Software Artifacts: Any bit of documentation that is associated to the software.
* Best Practices:
  * Design Practices
  * IDEs
  * Programming languages
  * Reviews and Inspections
  * Static Analysis
  * Testing Practices (diabolic testing)
  * Code Coverage
  * Version Control
  * Continuous Integration
  * *Why use best practices?*
  * Improve programmer productivity.
  * Reduce software faults and failures.
  * Support collaboration.

## Software Process

* Goal of Design: Decide the software's structure and the hardware's configuration.
  * How will individual classes and software components work together?
* Small Programs: ~10s classes/interfaces
* Medium Programs: ~1000s classes/interfaces
* General Design Flow:
  * What are the useful objects (candidate objects)?
  * What are the useful things objects should do (candidate behaviors)?
  * What are the useful things for each object to know (candidate state)?

### Requirements/Analysis

* Goal: Understand customer requirements for the software system.
* Difficult to get *right* because customers don't know what they want or how to communicate it.
* Requirements often evolve.
* Software Artifacts: Requirements documents, use cases, user stories.
  * CSC-216 uses "use cases".
  * Requirements Documents: Very formal "the system shall"
  * Use Cases: Grouped list of abilities of the system.
  * User Stories: A specific story about what a user is doing.

### Design

* Goal: Decide the structure of the software and the hardware configurations that support it.
* *What am I designing for?*
* Software Artifacts: Design documents, class diagrams, UML diagrams.

### Implementation/Code

* Goal: Translate requirements/design into concrete system.
* Decide the implementation language (should be driven by how you designed).
* Software Artifacts: Source code, bug database, config files, media, executables, source code repo

### Testing

* Goal: Find errors in software.
* *Do this as quickly as possible!*
* Software Artifacts: Test code (test harnesses, scaffolding, etc.), bug database, test database,
  test inputs/outputs, documentation.

### Integration

* Goal: Bring the software system together.
* Individual programmers work together to bring all their parts together.
* Software Artifacts: APIs, interfaces, integration documentation.

## Software Design Models

### Planned/Waterfall

* A planned, step by step method of development

{{ figure(src="waterfall.png", title="Waterfall Design Process") }}

#### Pros

* Allows workforce specialization
* Great for known requirements.

#### Cons

* Very hard to fix early issues.
* Takes forever to deliver.

### Iterative/Agile Model

* An iterative model that results in immediately useful products.

#### Pros

* Allows for more interaction between developers and consumers, reducing the likelihood of
  misunderstanding.
* Allows for more communication between developers reducing the risk of error, since they have to
  talk more between each iteration.

#### Cons

* Scope Creep: The expectation of the software increasing.

## Task Planning

* Task Planning: Assigning tasks in a logical way that optimizes the work people accomplish.
* Tasks should be focused around deliverables.
  * Deliverables: Specific objects/things that must be turned in or delivered.
* Tasks should have a time estimate attached to them
  * Ideal Time: The amount of time something should take ideally, no distractions, work 100% of
  time with 100% efficiency.
  * Elapsed Time: The amount of time it actually takes to do something.
* Story Points: A relative, unit-less measure of time to express the size/difficulty of a task.

### Pros

* Defines project scope
* Illuminates project deliverables
  * *What actually matters?*
* Accountability for teams
  * Reduce conflicts by identifying task owners
  * Increase leaderships

## Testing

* Testing = Process to find faults. "The *dynamic* verification of the behavior
  of a program on a finite set of test cases, *suitably selected* from the
  usually infinite executions domain, against the *expected behavior*."
* *Write black box test cases first!* That way you aren't biased.
* Tips:
  * Really just try to mess things up.
  * Think about equivalence classes.
  * For white box tests, think about cyclomatic complexity.
* Test code should be separate from source code.
* Test code should be javadoc'd as well as source code.
* **Iterate between tests and coding**

### Vocabulary

* Fault A bug. An incorrect process, step, or data definition.
* Verification: Evaluates whether the product is being built right.
  * White box testing. Code is known.
  * Test individual paths, correctly loops at boundaries, internal data
    structures, logical decisions are complete (handle true and false).
* Validation: Evaluates whether the right product is being built.
  * Black box testing. Code is unknown.
  * Incorrect or missing functions, interface errors, errors in data
    structures, behavior or performance errors, initialization and
    termination errors.
* Equivalence Classes: Chunks of input/output space that (should) all work
  identically. Pick a representative (middle!) value from these chunks.
  * This is part of the *suitably selected* part of testing.
* Cyclomatic Complexity: The number of paths of execution that can be
  taken through a program (or at least an estimate of it).
  * Easy way to find: Number of decisions + 1 (not always correct!)

### Types of Testing

* Unit: Tests a single bit of software (normally a method). Should be
  automated.
  * JUnit
* Integration: Tests a small group of software units together (or
  integrated!). Should be automated.
  * JUnit
* Functional/System: Tests a full, complete, integrated system / piece of
  software. Should be external.
* Acceptance: Tests done by client to make sure that software works as
  expected.
* Regression: A selective retesting of all other types of testing. This
  should always be (more or less) the same and should always be passed. *DONE
  TO MAKE SURE THAT PROGRAM WORKS AS EXPECTED.* Should be automated.
* Beta: Tests done by a subset of consumers. They just use the software and
  see if they like it!

### Test Case Information

* Unique Identifier
  * Black Box: Name of test in document.
  * White Box: Name of test method or specific assert.
* Input into the program or program unit
  * Black Box: How the user runs and interacts with the program. *Should be
    extremely specific.*
  * White Box: Inputs to a method that set up the test.
* Expected Results from the program or program unit
  * What you expect to get back, based off the requirements. *Should be
    extremely specific.*
* Actual Results from the program or program unit
  * Black Box: What the user is shown.
  * White Box: Return values or state from other methods or objects.

### Code Coverage

* Code Coverage: A measure of test case completeness.
  * Method Coverage: How many methods have been tested?
  * Statement Coverage: How many statements in each method have been tested?
  * Decision/Branch Coverage: How many decisions have been evaluated on
    their true and false path?
  * Condition Coverage: How many individual conditionals have been executed
    for both their true and false path? (EclEmma's Branch coverage)
* If you have 100% statement coverage, you have 100% condition coverage
* Coverage is not perfect and doesn't say that your test cases are strong.
* ***80-90% line/statement coverage is expected for each non-UI class.***
  * Never stop testing.
  * Double check on Jenkins.
* You can test coverage on non-whitebox tests too! :)

## Debugging

* Eclipse can debug code!
* Debugging lets you see code as it is running.
  * What line its executing.
  * The stacktrack.
  * The current data.
* Breakpoints: Things you can insert from the gutter to stop/pause code
  execution when it reaches that line.
  * Allows you to walk through your code step by step.
* Steps: How your program executes.
  * Step Over: Executes the next method as if it was a black box.
  * Step In: Executes a method by going into it.
  * Step Return: Goes to the return statement and finishes it.

## Analysis Types

* Static Analysis: Evaluating the code without executing it.
* Dynamic Analysis: Evaluating the code by executing it.
* Looks for obvious problems or misuses of APIs, ignoring invariants, etc.
* Issues:
  * False Positive: Reports bugs that program doesn't contain.
  * False Negative: Contains bugs that analyzer does not report.
* Our Tools:
  * FindBugs: Finds subtle bugs.
  * CheckStyle: Make sure that code is properly constructed in correct style.
  * PMD: Finds more style issues and content issues.

## UML (Unified Modelling Language)

* UML: Models OO software.
  * Converged from earlier standards (OMT, OOSE, Booch)
* Use Case Diagrams: Models the interactions between use cases.
  * Ovals: Use case
  * Stick Figure: User (can be library, person, etc)
* Class Diagram: Shows the interaction between different classes and objects. *Static.*
* Sequence Diagram: Shows the flow of the program through different methods and classes through a
  *specific* scenario. *Dynamic.*
* State Chart Diagram: Shows how models change state when performing a task.

### Class Diagrams

#### Class Attributes

* Attributes: An instance variable (including static).
* Form: `visibility name : type`
* Visibilities:
  * `+` -- Public
  * `#` -- Protected
  * `-` -- Private
  * `~` -- Package (default)
  * `/` -- Derived
* Static Attributes: Underlined

#### Class Operations/Methods

* Operations: Actions that the class can perform.
* Form: `visibility name(parameters : types) : return_type`
  * If `return_type` is void, omit it.
* Visibilities:
  * `+` -- Public
  * `#` -- Protected
  * `-` -- Private
  * `~` -- Package (default)
* Static Methods: Underlined.

#### Connectors

* Connector: Any arrow that connects two classes
* Generalization (is-a): Shows inheritance.
  * Interface Connector: Dashed arrow with triangular head points from concrete class to interface.
  * Abstract Class Connector: Solid arrow with triangular head points from concrete class to interface.
* Composition (has-a): There are quite a few different ones!
  * Attributes: Small things (Strings, primitives), part of existing library, immutable value
  objects.
  * Dependency: A Class needs another Class to work, but doesn't have any fields that are one.
  * *Shouldn't be included in CSC-216!*
  * Connector: A dashed line.
  * Association: A Class knows about an instance of another Class, but they are somewhat
  independent.
  * Connector: A solid arrow with `>` head from the container (source) to the contained
    (target) with numbers (multiplicity) to show how many containers have how many contained.
  * Aggregation: The container class essentially just controls a group of those Classes.
  Unidirectional.
  * Connector: A line with a white diamond next to the aggregate class.
  * Composition: The container class controls every part of the contained.
  Unidirectional.
  * Connector: A line with a black diamond next to the container class.
* Abstracts: Shows Classes that can't be directly instantiated. Italicized.
  * Implements: When a class implements an interfaces. Shown with dashed line with a white triangle
  head.
* Interfaces: Shows interfaces. Depend on the particular instance.

{{ figure(src="class_design.png", title="Event Class") }}

{{ figure(src="full_class_diagram.png", title="Wolf Scheduler Diagram") }}

### Sequence Diagram

* Message: Any piece of information or control that is passed between two classes. Solid arrow
  pointing to where the message went.
* Return Message: The result of the sent message. Dashed arrow showing the message going back to
  where it was called from

### Tools for Creating UML Diagrams

* Microsoft Visio
* Commercial Eclipse Plugins
* Violet UML (open source)
* Dia (freeware)

# Algorithmic Efficiency

* Big Idea: Generally, there is a trade off between runtime efficiency and size efficiency.

## Big O

* Big O Notation: A way of showing the trend of worst, case running time of an algorithm.
* You can specify specific cases and those will have different times, but then those are
  considered different algorithms.
* Specific, common growth rates are shown at the bottom in a table.

| Name    | Big O Notation  |
|-------------|-----------------|
| Constant  | $O(1)$      |
| Logarithmic | $O(log(N))$   |
| Linear    | $O(N)$      |
| Log-Linear  | $O(N * log(N))$ |
| Quadratic   | $O(N^2)$    |
| Exponential | $O(2^N)$    |

# Data Structures

## Stack

* Stack: A collection of data that can only be accessed in a Last-In First-Out (LIFO) manner. That
  is, you can only access the newest element.

### Methods of Interaction

* `push`: Adds an element at the top of the stack.
* `pop`: Removes and returns the element at the top of the stack.
* `peek`: Returns the element at the top of the stack.

### Usage

* Can't do for-each style coding because you can't access the inner elements.
* Instead do while not empty pop style.

### Uses

* When using postfix ($1 2 +$) or prefix ($+ 1 2$) notation, these can be stack
  evaluated.
  * For prefix notation, you push tokens onto the stack and, once you reach a
  function that takes $N$ arguments, you push $N$ more times and then pop $N
  + 1$ times (to remove the arguments and the operator), evaluate the
  function, and then push the result onto the stack.
  * For postfix notation, you push tokens onto the stack unless it is a
  function that takes $N$ arguments. Then you pop $N$ times, evaluate the
  arguments, and push the result onto the stack.

## Queue

* Queue: A colleciton of data that can only be accessed in a First-In First-Out (FIFO) manner. That
  is, you can only access the oldest element.

### Methods of Interaction

* `enqueue`: Adds an element at the back of the queue.
* `dequeue`: Removes and returns the element at the front of the queue.
* `peek`: Returns the element at the front of the queue.

## Trees

A tree is a *directed*, *acyclic* structure of linked nodes. These can be
binary, heaped, and more.

Trees are inherently recursive and thus it is strongly recommended that you
program recursively with it, especially *traversal* which is where you visit
every node in the tree.

For traversals, you should probably draw a diagram to see what order and how
you are traversing the tree.

Some uses of trees are representing the file structure using a *filesystem
tree*, representing/implementing AI machines using *decision trees*, and
compiling code using an *abstract syntax tree / parse tree*.

### Vocabulary

* **Directed** means links are one-way.
* **Acyclic** means no path crosses a node twice.
* **Balanced**: The property of a tree being at or near its minimum height.
* Tree Properties:
  * **Height**: The number of nodes between the current node and the lowest leaf node.
  * Really +1 the height of its child.
  * **Depth**: The number of nodes between the current node and the root node.
* Types of Traversals:
  * **Pre-order** is where you process the branch, the left, then the right.
  * Start from the top and go down.
  * **Post-order** is where you process the left, the right, then branch.
  * Go to the bottom and then go up.
  * **In-order** is where you process the left, the branch, then the right.
  * If you draw the tree such that the distance between sibling nodes halves
    each level you go down, this is really easy.
* Types of Nodes:
  * **Branch** nodes have a parent and a child.
  * **Leafs** have no children.
  * The **root** has no parent, and is the ancestor of all nodes. This can also
  be a branch or leaf.
* Node Relations:
  * A **parent** is a node that points to the current node.
  * A **child** is a node that the current node points to.
  * A **sibling** is a node with a common parent of the child.

## Binary Search Tree

A *binary tree* is a tree where each branch only has two children.

A *binary search tree* is a binary tree that cannot contain duplicates where
each branch is strictly greater than the max value in its left child's tree
(and thus is greater than its left child) and strictly less than the min value
in its right child's tree (and thus less than its right child) and each of its
children are binary search trees.

A binary search tree has to take at most the height of the root node to find an
element at a given element. This makes it important to try your best to keep
the tree as close to its minimum height as possible (this means *balanced*).
For balanced binary search trees, the efficiency is near $O(log_2(n))$. For
unbalanced binary search trees, the efficiency is near $O(n)$.

### Adding Elements

1. Start at the root as your branch.
2. If the element is the same as the branch,
3. Else if the branch is empty, insert the element there.
4. Else if the element is less than the branch, add the element to the left side.
5. Else if the element is greater than the branch, add the element to the right side.

In Java, it is recommended to do adds by reassigning your node with a function.

```java
public void add(E element) {
  this.root = add(overallRoot, value);
}
private Node add(Node branch, E element) {
  if (branch == null) {
    branch = new Node(element);
  } else if (E < branch.data) {
    // You'd really do compareTo here but it's
    // hard to read
    branch.left = add(branch.left, element);
  } else {
    branch.right = add(branch.right, element);
  }
}
```

### Getting Elements

* *Getting Minimum*:
  1. If you don't have a left, return yourself.
  2. If you do, go left.
* *Getting Maximum*:
  1. If you don't have a right, return yourself.
  2. If you do, go right.

### Removing Elements

1. Find your appropriate node.
2. If you have two children, set yourself to the min of the right tree (or max of the left tree).
3. If you have one child, replace yourself with your child.
4. If you have no children, kill yourself.

## Heaped Trees / Heaps

A *heaped tree* or *heap* is a tree which satisfies the heaping property, that
is each node is either greater than or less than its children. If it has the
prior, it is called a *max heap* because the root is the max element. If it has
the latter, it is called a *min heap* because the root is the min element.

# Data Structure Modification

## Searching

*How do you find things in data structures?* One way is by arranging things in
some natural order.

There are two categories, **sorted** and **unsorted**.

* Sorted: Slower insertion/up-front. Faster retrieval/end.
* Unsorted: Faster insertion/up-front. Slow retrieval/end.

There are many methods, each have trade-offs:

* Sequential Search:
  * Definition: Start at element 0.
  If you are on the element you want, you found it.  Otherwise, go to next
  element.  At any time, if you are at the end, the list does not contain the
  element.
  * Efficiency: $O(n)$
  * Pros: Works for unsorted lists.
  * Cons: It's fairly slow.
* Binary Search:
  * Definition: Locate target by selecting middle element, this is your pivot
  point. If your element should go before the pivot point, look only at that
  half. Likewise for your element after the pivot point. Select middle
  element of that half as your new pivot point.  Recurse.
  * Efficiency: $O(log_2(n))$
  * Pros: Is fast.
  * Cons: The list must be sorted.

```java
// This is like java.util.Arrays#binarySearch
private static int
binarySearch(int[] list, int value, int min,
             int max) {
  if (min > max) {
    // Missed element
    return -1;
    // java.util.Arrays#binarySearch(array,
    // value) returns -(min + 1), or insertion
    // point
  } else {
    // List not empty
    int pivot = (min + max) / 2;
    if (value < list[pivot]) {
      //
      binarySearch(list, value, min, pivot - 1);
    } else if (value > list[pivot]) {
      binarySearch(list, value, pivot + 1, max);
    } else {
      return pivot;
    }
  }
}
```

## Sorting

Sorting is ordering items into their natural ordering. There are many different
ways to do this, each with trade offs:

* Bogo Sort:
  * Method: Shuffle and check if its sorted. Repeat until sorted.
  * Efficiency: $O(n!)$.
* Selection Sort:
  * Method: There are two parts of the list: the sorted and the unsorted;
  everything starts unsorted. Find the smallest value in the unsorted part
  and place it at the end of the sorted part.
  * Efficiency: $O(n^2)$.
* Bubble Sort:
  * Method: Start on the first element. Compare the current element to the
  next, swapping them if they are not in the right order. Do this until you
  reach the end of the list. Do this until the list is completely sorted.
  * Efficiency: $O(n^2)$ but slower than selection sort due to doing more swaps.
* Insertion Sort:
  * Method: There are two parts of the list: the sorted and the unsorted;
  everything starts unsorted. Take the first element in the list and insert
  it into the sorted part in sorted order. Do this until there is no unsorted
  part.
  * Efficiency: $O(n^2) but normally faster than selection sort because you do
  fewer comparisons.
* Merge Sort:
  * Method: We already know how to merge two sorted lists (by having multiple
  read heads and taking the smallest value at any of the read heads). If our
  list is length 1, it is trivially sorted. If our list is unsorted, we split
  the list into a left and right half and merge sort those. Then we merge
  those two now sorted halves (each lists their own!). The list is now
  sorted.
  * Efficiency: $O(n * log_2(n))$
* Quick Sort:
  * Method: Pick a pivot element and split the list into two parts, either
  larger or smaller than the pivot. Sort those sub lists. The pivot goes
  right between these two sublists. The list is now sorted.
  * Efficiency: $O(n * log_2(n))$ (can be worse with bad pivots).
  * It really matters what pivot you pick. There are different ways to do it:
  * Pick first. (good and easy if unsorted)
  * Pick randomly. (good on average)
  * Pick median of first, middle, and last. (great for sorted and reverse sorted elements)

# Finite State Machines

* Finite State Machine: A system that can have only a fixed set of inputs, states, and transitions.
  * The state is held in memory.
* *Why use FSMs?*: They can describe almost all systems easily. They are very easy to implement.
  They're also just interesting!
* Guard: Something which must be true for a transition to occur.

## Diagrams

* FSM Diagram:
  * State: A circle.
  * Final State: A double-layered circle.
  * Inputs: A letter or other identifier.
  * Transition: Arrows labeled with the input given.
* Transition Tables: A tabular method of showing the possible states.
  * Inputs: Heading.
  * State: First Column.
  * Transition: Intersection between state's row and heading column.

## Examples

* A vending machine modeled by a finite state machine:

{{ figure(src="vending_machine_fsm.png", title="Vending Machine Diagram") }}

* Compilation of code:

{{ figure(src="pascal_compiler_fsm.png", title="Pascal Real Constant Compiler") }}

* Substring Finding:

{{ figure(src="abba_fsm.png", title="Simple Text Processing for 'abba'") }}

* Text Processing:

{{ figure(src="wc_fsm.png", title="`wc` as a FSM") }}

| State | `A-Za-z`      | `\n`        | Other   |
|:-----:|-------------------|-------------------|-----------|
| 0   | 1: `++wc`, `++cc` | 0: `++lc`, `++cc` | 0: `++cc` |
| 1   | 1: `++cc`     | 0: `++lc`, `++cc` | 0: `++cc` |

## While-Switch Idiom

* While you have input, **switch on your state**, and then modify your state and
  other variables based off your given state and the input.
  * Switching on state doesn't really matter, but Dr. Heckman cares.

```no-highlight
while you have input:
  switch(STATE):
    case STATE_0: ...
    case STATE_1: ...
    case STATE_2: ...
    case STATE_3: ...
```

```java
// Replicates wc functionality
while ((next = br.read()) != −1) {
  ch = (char) next;
  switch (state) {
    case 0:
      if (ch == '\n') {
        ++lc;
        ++cc;
      } else if (Character.isLetter(ch)) {
        state = 1;
        ++wc;
        ++cc;
      } else {
        ++cc;
      }
      break;

    case 1:
      if (ch == '\n') {
        state = 0;
        ++lc;
        ++cc;
      } else if (Character.isLetter(ch)) {
        ++cc;
      } else {
        state = 0;
        ++cc;
      }
      break;

    default:
      System.out.println(
        "Invalid state: " + state
      );
  }
}
```

## Object Oriented Implementation

This only works for object-oriented paradigms.

Use the [state pattern](#state-pattern). This is useful if all your states have
to handle all/most types of input.

This works with bounded recursive loops. (This is when a state has some data,
which is formally illegal but simplifies implementation.)

## Functional Implementation

This only works with functional paradigms.

Instead of having objects that implement a common interface, you can have a set
of functions that represent state. Each function knows how to handle an
arbitrary input, parses it, and returns the appropriate state (function).

You set the current function to the call of the current function with the
input.

```
StateFunction curr = defaultStateFunction
while input:
  // curr returns a StateFunction
  curr = curr(input)
```

This does not work with bounded recursive loops.

# Recursion

* Recursion: Defining something using itself.
* *Why use it?*
  * It works better for some things. For example, some things are inherently
  * recursive.
  * Trees are inherently recursive (so are files).
  * Some searches are inherently recursive.
  * Some functional languages use only recursion. (e.g. Haskell, Scheme, etc.)
  * It can be mathematically proved to work much more easily through induction.
  * It's really elegant.
* *How do you write recursively?*
  * You just treat the problem as if you've already solved a smaller but
  *completely* identical problem.
  * Try to break the problem into a smaller but identical problem.

## Verification Methods

* Static Analysis (Static): Check for various style and general techniques.
* Testing (Dynamic): Actually run your code and make sure it works.
* Formal Analysis (Static): Mathematically prove this program calculates
  correctly (normally using discrete mathematics).
  * It is harder to prove that it does what the client whats for the given
  inputs.
  * You normally use mathematical induction.
  * *Mathematically Induction?* You use your basis step (base case) followed
    by inductive step (recursive).
  * You have to correctly identify the recursive/inductive step.

## Important Notes

* Calling a function takes over the flow of control, unless you are using
  forking / multiprocessing / multithreading.
* Sometimes recursive solutions are very inefficient if they need to calculate
  values repetitively or need to make several function calls for something
  trivial.

## Types of Recursive Functions

* Linear/Trivial: The function only calls itself once. Can almost always be
  iterative.
  * Often $O(n)$
* Branching: The function calls multiple instances of itself. Often must be
  recursive.
  * Sometimes $O(n^2)$

## Creating a Recursive Solution

* Base Case(s): A trivial example of the problem with a known solution.
  * Try to choose the cleanest, best, simplest base case.
* Recursive Case: A more complex example that can be solved by solving a
  simpler version and then doing something with it.
* Your function must have a size parameter, so that it can end. It should be
  decreasing (but not necessarily monotonically).
* Check the size parameter, it it is small, solve the base case. If not, solve
  the recursive case.

## Public-Private Pairs in Recursive Methods/Functions

Sometimes you need more information to accumulate in a recursive method that
always has the same default value. To do this, you create a public method that
has only a restricted number of parameters. This public method then calls on
the private method with the "default value".

This is essentially a workaround for not having true default values and also
making sure your clients don't have to worry about that.

```java
public void crawl(File f) {
  crawl(File, "");
}

public void crawl(File f, String indent) {
  System.out.println(f);
  if (f.isDirectory()) {
    for (File subfile : f.listFiles()) {
      crawl(subfile, indent + "  ");
    }
  }
}
```

## Using Control Flow as a Data Structure

Using recursion, you can use the method call stack as a data structure. *How?*
You store a local variable in the method cal, call the method recursively, and
then do something with the local variable after the recursive method completes.

```java
// This only works with synchronous method calls
void reverseLines(Scanner input) {
  if (input.hasNextLine()) {
    // "Push" something onto the "stack"
    String line = input.nextLine();
    // Add a new method to the call stack
    reverseLines(input);
    // "Pop" something from the "stack"
    System.out.println(line);
  }
}
```

* Cohesion: How much one class represents a single abstraction. (Allows for
  reuse!)
* Coupling: The amount with which one program calls upon another.
  * Internal Coupling: One class modifying another's data.
  * Parameter Coupling: Using services provided by another class.
* Encapsulation: A piece of software having a small, controlled, logical number
  of ways to interact with it.
* Software Artifacts: Any documentation. Design documents, class diagrams,
  other UML diagrams.
* Serialization: The process of saving a Java object's state to a file.
* Deserialization: The process of reading a Java object's state from a file.

# Misc

## Horner's Rule

* Horner's Rule: A method for parsing numbers as polynomials.
  * $1092 = (((0 + 1)x + 0)x + 9) + 2$ where $x$ is the given base
* Why is Horner's rule useful? Because it can be used to convert ASCII into
  numbers, since ASCII digits are all consecutive in terms of value.
* Summary: Read value, shift by base, repeat.
