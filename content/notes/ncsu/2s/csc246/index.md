+++
title = "CSC 246: Operating Systems"
[extra]
teacher = "Dr. David Sturgil"
+++

# Terms

* Operating System: Creates a layer of separation between hardware and
  application. A program that helps other programs run.
  * Virtualizes hardware, normally mandatory.
  * Provides system calls (syscalls).
* Virtualization: Abstraction over underlying hardware, making it easier to
  use, share, and reason about. For example, UNIX's *everything is a file*
  abstraction.
* System Calls: Requests the operating system to do something. This can be
  expensive (because of interrupts) and obtuse, so normally you call these
  through a library.

# Computer Architecture

In this class, we'll consider a simplified model of a computer because they're
complex.

We also follow the Von Neumann architecture, which is the processor and memory
model, where you put program in memory.

* CPU: Processor executing your code.
* CPU Cache: Tiny amount of incredibly fast memory your CPU uses. Amortizes
  cost of memory accesses.
  * Cache Hit: CPU finds what it wants in the cache.
  * Cache Miss: CPU does not find what it wants in the cache.
* Memory: Volatile memory containing your working program and data.
* Device Controllers: Control specific hardware, varies wildly depending on
  computer.
  * Includes persistent storage, such as disk controllers.

{{ figure(src="simple_computer_architecture.png", title="Simple Computer Architecture") }}

## Storage Hierarchy

Sadly, we haven't found any storage device that is faster, cheaper, and larger
than every other option. Because of this, we have to make engineering decisions
to improve performance.

We usually do this by creating a **storage hierarchy** of memory going from
small and fast to large and slow. We tend to use the smaller, faster memory
**cache** to temporarily store data for the larger, slower memory **backing
store** to try to get the best of both worlds.

## CPU Cache

Programs normally exhibit **temporal locality**, where they are likely to
access things accessed recently, and **spatial locality**, where they are like
to access things near things accessed recently.

Since we normally both *read* and *write* to the cache, the backing store may
become out of date. To resolve this, we need a write-policy to keep them in
step.

* Write-through: The hardware automatically writes to the backing store (RAM)
  whenever the cache is written to.
* Write-back: Whenever (a portion of) the cache is cleared / replaced, write it
  back to the backing store to get updates.

## Device Controllers

Here's a quick breakdown on how programs can access hardware.

* System call: OS receives requests from application.
* Command: OS makes requests to hardware.
* Interrupts: OS is notified when hardware needs service.
* Upcall: OS can notify application of events of interest.

{{ figure(src="switching_layers.png", title="Overview of Layers") }}

### CPU to Device

Most device controllers have a few registers to communicate with the CPU.

* Status registers: To check what it’s doing.
* Data-in registers: To give it some data.
* Data-out registers: To get some data back.
* Control registers: To tell it what to do next.

That's cool and all, but how do you tell the CPU to use these? There's two main
ways.

* Port-Mapped I/O: Special CPU instructions for IO. Somewhat common on embedded
  systems with a set number of devices.
* Memory-Mapped I/O: Computer hardware reserves a part of address space for
  devices. The CPU then accesses these as if they were just normal memory, but
  the hardware redirects the requests.

### Devices to CPU

There are a few ways for the device to tell the CPU about things, like
completing a request or something.

* Polling: The CPU must know to look at the status registers to check out the
  device. *Can be inefficient if you're polling a ton.*
* Interrupts: Hardware supported system. The hardware fires off an interrupt
  and the CPU will automatically do jump to an interrupt handler.
  * Interrupt Handler: A subroutine that runs whenever an interrupt is fired.
    Can be arbitrarily long, but should be short to prevent latency spikes.
  * Interrupt Vector: List of addresses of subroutines to run when interrupt
    fires off.

*Note:* Interrupts are similar to CPU **traps** (exceptions) that occur
whenever a bad instruction occurs, like divide-by-zero.

### Bulk IO

Some devices need to dump a lot of data into the computer. We normally do this
using a **direct memory access (DMA)**, which puts data from a device into the
system's memory.

## Hardware Protection

### CPU

It can be dangerous to any program to run every operation provided by the
hardware. Therefore, most hardware uses **dual-mode operation** where there are
two modes:

* Kernel Mode: Can access all instructions and all registers, privileged and
  unprivileged.
* User Mode: Can only access unprivileged instructions and registers.

*Note:* Modern hardware often has more than just these two modes, but we won't
talk about that here.

How do we switch modes? Normally, there are special instructions to switch to
the appropriate mode. The kernel automatically switches back to user mode
whenever it needs to, but how do you switch from user mode to kernel mode? The
answer is *system calls* and *interrupts*.

Interrupts automatically switch to kernel mode at the start and switch to user
mode (or whatever the old mode was) at the end.

System calls trigger a special trap on the CPU which goes into the appropriate
system call.

*How do we prevent user programs from preventing the OS to run?* The normal
solution is to have a **timer interrupt**, which fires at a countdown to allow
the OS to take control of the CPU eventually.

### I/O & Device Controllers

If you use port-mapped IO, it's easy to do protection. Just make those special
instructions privileged.

If you use memory-mapped IO, you have to use memory protection.

### Memory

Modern memory protection is very sophisticated. Here, we will use a simpler
model that considers only a **base register** and a **limit register**. The
base register stores the start of valid memory addresses. The limit register
stores the size of the range. The hardware automatically checks these on all
memory accesses.

*Note:* These registers are privileged registers, meaning only the kernel can
change them.

{{ figure(src="memory_protection.png", title="Memory Protection") }}

# OS Architecture

## Microkernel

Microkernels take the position that *as little as possible* should be put in
the kernel / run in kernel mode. This means that parts of the OS that normally
run in the kernel (e.g. device drivers and file systems) instead run in
userspace as processes.

Why should we do this?
* Easier to port to new machines (less code).
* Less likely there will be bugs (less code).
* Less code in kernel mode.
* More extensible and modular. (Think about `rclone mount` and FUSE.)

Why shouldn't we do this?
* Switching between kernel mode and user mode is expensive (interrupts).

## Monolithic Kernel

Monolithic kernels are the traditional design. It's where the kernel performs
basically everything you'd expect an operating system to do.

Why should we do this?
* It has higher performance because it switches less between kernel and user
  mode.
* Kernels grow very naturally.
* You can work around the disadvantages pretty easily (see next section).

Why shouldn't we do this?
* Less extensible and modular.
* Harder to port to new machines.

### Kernel Modules

A class of dynamically loadable parts of the kernel. These can be run in user
mode or kernel mode once loaded.

There are often specific *types* or *classes* of kernel modules, in a
object-oriented manner. Modules implement interfaces specified by these types
and that allows the kernel to load them.

In Linux, these are `.ko` (kernel object) files.

## Boot Up

Operating systems can be huge. This means that they don't fit in a page of
memory (basically a section of memory) and can't be trivially loaded by
hardware. To mitigate this, we write small programs called **bootloaders**,
which help load your operating system.

Here's a quick overview of the standard steps that occur whenever you turn on
your computer. Different systems may have slight modifications, but the general
process remains the same.

1. Start running firmware at known address.
1. Load bootloader from secondary storage.
1. Bootloader copies kernel into memory ad begins execution.
1. Kernel initializes necessary data structures (e.g. interrupt vectors).
1. Kernel starts running init process (in user mode).

More modern computers can use EFI stubs, which (can) completely replace
bootloaders. However, we won't cover that here.

# Inter-Process Communication (IPC)

There are many ways to do IPC. The two standard models involve either **direct
sharing** of memory (or other hardware) or **message passing**, which is a
fancy way to say copying memory or other things.

## Signals

The simplest is signals. They are mostly used to cancel, kill, or do something
similar to the process. For example, `CTRL-C` sends `SIGINT` (interrupted),
which tries to interrupt (and normally terminate) the process which received
the signal.

This is hardly inter-process communication.

## Message Passing

*This is easier to get right, but (theoretically) less performant.*

Processes have independent *mailboxes* that can hold data. Other processes can
copy messages / data into your mailbox by going through the operating system.
Only you can read your mailbox. No other process can read or write to your
mailbox.

There are two main ways to do this. *Direct*, where you send directly to a
process, or *indirect*, where you send through a named communication channel
(e.g. named pipes).

The kernel may temporarily copy data into its own memory while it waits to
deliver. This is called **buffering**.

### Anonymous Pipes

* `#include <unistd.h>`
* `pipe(int fds[2])`: Create pipe with read end `0` and write end `1`.
  * Use alphabetical order of read and write to remember the numbers. (Or just
    `man pipe(3)`.)

Pipes are queues of bytes that don't respect message boundaries. You give it a
2-array of ints and it gives you two file descriptors, a read end `0` and write
end `1`.

*Message boundaries?* Basically, if you write 2 bytes, 5 bytes, and 3 bytes to
a pipe, the other end will see just 10 bytes.

POSIX defines `send` and `recv` syscalls that can send and receive messages on
pipes. However, you can also use `read` and `write` syscalls, and you'll
normally want to.

You normally use pipes by calling pipe, forking, and then having one process
close one end and the other process close the other end (to prevent the OS from
mistakenly thinking that someone is still using the pipe). When all write ends
of the pipe is closed, from the child exiting or manually closing the pipe, the
read end of the pipe receives an `EOF`.

*Note:* If you max out the OS's buffer, the `write` syscall blocks.

### POSIX Message Queues

* `#include <mqueue.h>`
* `mq_open()`: Opens message queue. Give it a maximum message size and maximum
  number of messages to store.
* `mq_send()`: Sends message across queue.
* `mq_receive()`: Receives message from queue.
* `mq_close()`: Stop using the message queue.
* `mq_unlink()`: Destroys the message queue.

Message queues are named queues of bytes that respect message boundaries.

Message queues are identifiable by a unique name (starting with `/`) across
completely separate processes on the machine. They have their own completely
different syscalls, unlike files and pipes, i.e. you can't use `read` or
`write` on them.

Message queues can live longer than the process that makes them and can exist
without any process making them. To remove them, you must call `mq_unlink` to
destroy the message queue.

If you want to create the message queue, but one already exists, you get an
error through `errno`. If you want to hook up to an existing message queue, but
one doesn't exist, you get an error through error through `errno`.

## Shared Memory

* `#include <sys/shm.h>`
* `shmget()` (Shared Memory Get): Create a shared memory identifier (`int`) for
  a section shared memory. This memory is automatically zeroed.
* `shmat()` (Shared Memory Attach): Attach the shared memory to your address
  space, making it look like just another pointer. You can mark this memory as
  read-only (`SHM_RDONLY`), write-only, or read-write.
  * You can specify a memory address to attach to, but you probably shouldn't.
 `shmdt()` (Shared Memory Detach): Remove the shared memory at the given
 pointer from your address space, but don't delete the shared memory.
* `shmctl()` (Shared Memory Control): Delete (or otherwise control) the shared
  memory given by the shared memory identifier (`int`).

*This is hard to get right, but (theoretically) more performant.*

There is a block of memory that both processes can read and write to. The
operating system does very little control and trusts the programs to get it
right.

This is accessed just like any other buffer because the OS maps the shared
memory into your program's address space.

## Blocking

Whenever your program asks for something that the OS can't provide immediately,
your process will **block**. (Assuming you're using a blocking system call.)
When your process blocks, the OS puts your process into a waiting state, where
it is not taking up (m)any resources. The OS will wake up your process when it
gets what you asked for.

There are a few main blocking methods for IPC:
* Blocking Receive.
* Non-blocking Receive.
* Blocking Send.
* Non-blocking Send.
* Rendezvous: Blocking send and receive, with no buffer.

### Buffering

Buffering is how we let non-blocking send work. The OS temporarily holds the
data being shared while the receiver (ideally) catches up. This lets the sender
not be slowed down.

### Busy Waiting

Busy waiting is when your program takes as much CPU time as it can to just wait
for things. *This is terrible.* It's basically a poor man's blocking.

# Processes

There are a bunch of ways to handle parallelism / concurrency. We will cover
processes right now.

**Processes** are separate programs identified by a **PID** (process
identifier). They have separate, protected memory and (can) run on separate
CPUs. Processes can only interfere with each other in controlled ways (e.g.
shared memory, signals, pipes). Processes also have the concept of privilege,
which we'll cover later.

## Syscalls

* `fork`: Create a child process. Both the child and the parent run the same
  program with the same variables on the same line. On the parent `fork`
  returns the PID of the child. On the child, it returns 0.
* `wait`: Wait for a child to terminate. If given a PID, it waits for that
  specific child. If not given a PID, it just waits for any one child.
  * Child termination forms a queue. Whenever you wait for a child, it pops
    that child off the queue, blocking if the queue is empty.

## Memory Layout

Processes has multiple sections of memory. They aren't really contiguous, but
it's easy to visualize that way.

* Text: Immutable data, can be shared.
* Data: Mutable data, should not be shared.
* Stack: Local variables, return addresses.
* Heap: Dynamically allocated memory.

{{ figure(src="process_memory_layout.png", title="Memory Layout") }}

## Process Organization

Process are normally organized into a **process table**, which is a list of all
PCBs on the system. However, this is not very useful for scheduling.

To make scheduling more efficient, we keep scheduling queue(s), which is a list
of PCBs for processes waiting. These queues are organized in various ways to
make scheduling more efficient. Here's a few common ones.

* Ready Queue: Ready to run.
* Device Queue: Waiting on a specific device.

{{ figure(src="process_queues.png", title="Process Queues") }}

### Time Sharing

Whenever the OS does work, it may not switch back to the process that was
previously running. The OS has a **scheduler** which it uses to determine what
process to next run. They are incredibly complicated, so we will cover that
later.

Switching between processes requires a **context switch**. A context switch is
where the OS writes out all CPU registers (and other data) into memory and
loads another process's saved data. It then executes the process whose
data it just loaded.

This is great because it allows for processes to share! However, it is *very
expensive* because processes keep track of a lot, for example:

* PID.
* Copies of program counter and other CPU registers.
* Memory bounds.
* Accounting information.
* Resources in use (e.g. open files).
* Pointers for linking PCBs into various lists.

*Where does it store this info?* The OS stores the info in a **process control
block**, which is a block of memory that the OS sets aside for process
information.

### Process State

This isn't related to the process control block we talked about earlier.
Instead this deals with *scheduling*.

This state indicates how the OS should treat the process during scheduling. The
specific design may be different, but this is the standard.

* New: Created and can't be run yet.
* Running: Executing instructions on a CPU.
* Waiting: Process has requested I/O (or something else) and can't run until
  it's complete.
* Ready: Process is runnable, but isn't on a CPU right now.
* Terminated: Process has finished, still has a process ID, but isn't runnable.

{{ figure(src="process_scheduling_states.png", title="Process Scheduling States") }}

### Types of Processes

In terms of scheduling, it is useful to think about what the process spends
most of its time doing. To help think about this we use a *CPU-IO burst cycle*,
where programs switch between waiting on IO and using the CPU. *CPU bound
processes* are programs that spend most of their time using the CPU. *IO bound
processes* are programs that spend most of their time waiting for IO.

### Process Tree

POSIX organizes processes as a tree, where processes have a parent and a child.
The root is called the **init** process and is what runs initially and forks
off every other process.

There are many models on how parents and children operate. They can share
everything or share nothing. POSIX is somewhere in between. The child can be
can run the same program as the parent (POSIX `fork`) or run a completely
different program (Windows `CreateProcess`).

*Note:* In POSIX, you use the `exec*` family of syscalls to replace the running
process a different program. These system calls (if successful) never return.

*What happens if the parent of a process dies?* In POSIX the child keeps
running normally, but the OS sends you a signal that your parent died. In other
systems, there is *cascading termination*, where the the OS kills the child
(and its children).

# Threads

Threads are like processes that are even more cooperative (but less so than
coroutines). They share code, data, heap, and OS allocated resources (e.g.
files). They have different CPU registers, positions in code, and stack.

{{ figure(src="thread_stacks.png", title="Process Address Space Illustration") }}

For performance reasons, we want to keep the per-thread state as little as
possible to ensure that we can quickly switch between threads and start
additional threads. In other words, we want to keep the **thread control
block** tiny.

## POSIX Threads

* `#include <pthread.h>`
* `pthread_create`: Creates a new thread with a *given start routine*. This
  start routine is the lifetime of the program, like `main`. This can give the
  start routine some data.
* `pthread_join`: Wait for the given thread to return / exit. This can return
  data by filling in a pointer.
* `pthread_exit`: `exit()` but for a thread and returning abstract data.

A start routine returns a `void *` and accepts a single `void *`. This is used
for input and output. *Make sure that the argument and return have appropriate
lifetimes.* You should be very careful about giving/returning data between
threads on the stack. In general, you'll want to heap allocate the argument and
return.

## Java Threads

`java.lang.Thread` is how Java represents Threads. There are many different
ways to tell Java what to run in the thread. You can subclass `Thread` and
override its `run` method. Then when you start instances of this subclass, they
run your `run` method. You can pass `Thread` itself a `Runnable` (either a
subclass or a lambda expression). Then running that instance of Thread will run
that `Runnable`.

Java's threads don't run immediately. Instead you must call `start` on them for
them to start. You can then `join` on them.

You can also make a `Thread` a daemon, by calling `setDaemon` to it. This must
be set before you start the thread. This makes it run in the background (and
thus run the JVM in the background). Like a daemon!

Java does directly support arguments too threads or returning from threads.
Instead, you must subclass `Thread` to add the arguments via a constructor and
return the arguments by having attributes on the thread that you look at at the
end.

## User-Level Threads / Coroutines / Green Threads

User-level threads are where you implement threading in userspace either by
using a single thread / process or multiple without the kernel being aware that
you are running multiple threads.

Using OS provided threads requires syscalls, which can be expensive. It's also
not very portable because each OS tends to provide different interfaces.
Because of this user-level threads can be quicker and more portable.
Theoretically, user level threads can be even more cooperative too.

However, naive user-level threads have one huge issue: **blocking**. When a
single one of your user-level threads makes a blocking syscall, the OS might
block your entire thread, preventing all your other user-level threads to
execute. There are many different ways to handle this. Go does this by creating
a new blocking thread for each blocking syscall, so the kernel blocks that
thread and not the one you were using.

## Thread Pools

A common way to get around the issues with context switching and the cost of
creating threads is by creating a fixed size thread pool. You then split up
your work not by threads but by units of work. Then the thread pool distributes
the work among the finite number of threads.

## Thread Cancellation

How do you ask/tell a thread to die? If it dies at the wrong point, it might
leave your data (which is shared by many threads) corrupted / inconsistent.
There are two main ways.

* Asynchronous Cancellation: Force a thread to right now.
* Deferred Cancellation: Create cancellation points, where the thread checks
  whether it should still be running. Then the thread terminates gracefully.

## Contention

Threads can either run only within their process or run against other
processes. *Process contention scope* is where the thread only competes for
time against other threads within its process. *System contention scope* is the
thread competes for time against all other processes on the system.

*Note:* `pthreads` let's us specify a thread's scope.

# CPU Scheduling

When does the CPU scheduler run? If your scheduler does the last two, it's
called **preemptive** because it can forcefully interrupt a process.
* Process terminates.
* Process voluntarily yields the CPU.
* Process blocks (syscall).
* Another process finishes waiting (hardware interrupt). *Preemption*.
* Process has had enough CPU time for now (timer interrupt). *Preemption*.

Once we pick a process, we need to do *process dispatch* via a **dispatcher**.
This installs saved context, switches modes, and updates memory bounds. The
time it takes to do this is called *dispatch latency*.

A CPU scheduler wants to min-max the following. However, notice that *there is
no globally optimal solutions for all cases*. For example, minimizing response
time requires more context switches, causing more context switches and
decreased throughput.
* CPU Utilization: How often is the CPU running a user process.
* Throughput: How many processes (or CPU bursts) are finished per time unit.
* Turnaround time: Time from when a job is submitted until its done.
  * Normally not great for benchmarking scheduler performance.
* Waiting time: Time a process spend in the ready state.
* Response time: Time from when a job becomes runnable to when it starts
  producing output.

*Note:* For measuring effectiveness, we normally measure waiting time, since
that is due largely to the decisions of the scheduler.

## First-Come, First-Served (FCFS) Scheduling

This incredibly simple method of scheduling just runs processes in the order
they arrive and runs them without preemption.

It is *fast*, taking constant time for inserting new processes and selecting
new processes, and has reduced scheduling overhead by being non-preemptive.

FCFS schedulers exhibit the *convoy effect*, where you can have many processes
that need short CPU bursts piled up behind a few that need a lot time.

## Shortest Job First (SJF) / Shortest Remaining Time First (SRTF) Scheduling

SJF/SRTF is a provably optimal scheduler in terms of waiting time (for
non-preemptive and preemptive schedulers respectively). What SJF does is look
at the jobs' burst time and schedule the job with the shortest burst time
first. What SRTF does is look at the jobs' burst time and schedule the job with
the smallest remaining time first; when a new job arrives, it interrupts the
currently running one to put the one with the smallest remaining time back in.

They are virtually identical, but SJF is non-preemptive, which SRTF is
preemptive.

Even though these are theoretically optimal for average waiting time, in
practice they rely on us knowing (approximately) the running time of a process,
which is *unrealistic*, and there's also a risk of *starvation*.

### Approximations of Running Time

There are several ways to estimate the time a CPU burst needs. Most of them
involve statistical techniques using the process's previous CPU burst times.

One way is a simple *average* of your previous bursts. Another way is an
*exponential average* of your previous bursts (weight the previous ones
exponentially less).

The math for exponential average, where $\tau$ is the estimate burst time, $b$
is the actual burst time, and $\alpha$ is some arbitrary constant (1 is more
reactive, 0 is more smoothing)

$$\tau_{n+1} = \alpha b + (1-\alpha)\tau_n$$

## Priority Scheduling

Priority scheduling gives every process a priority number. We then schedule
things with a higher priority first. In pure priority scheduling (what we'll do
in this class), we only look the priority of a process, ignoring time.

Priority scheduling is not inherently preemptive or non-preemptive.

*Note:* In this class, we consider smaller priority numbers to be higher
priority to match POSIX.

In Linux, you can change the priority of your process by using the `nice`
command. It ranges from -20 to 19, but regular users can't set negative
priorities (which are higher).

## Round Robin (RR) Scheduling

Here, we chunk up time into *time quantums* (normally between 10-100ms) and
then distribute these in a round-robin fashion. You maintain a ready queue of
processes. Whenever you start a new time quantum, your program picks the first
process of the ready queue. When you end a time quantum, the OS preempts the
process, putting it on the back of the ready queue, and taking the next one off
the queue. If your program blocks before its time quantum is done, the program
just goes to the next time quantum early.

*Why is this good?* This bounds wait time to $(n - 1)q$. It makes CPU time very
predictable, because you always get $1/n$ time, so it's like you processor is
just $n$ times lower. This means turnaround time is longer but response time is
quicker.

*How do you pick a good quantum?* There's a trade-off between response time and
overhead. The smaller your time quantum, the faster your response time but the
more overhead (from context switches). The larger your time quantum, the slower
your response time.

## Real-Time Scheduling

Real-time scheduling is when the scheduling of your program is a critical part
of its correctness. As in, your operating system must guarantee that a process
can run within say 5ms and let it run for say 10ms. Failure to do so would be a
critical failure. *These are called hard real time operating systems /
schedulers.*

Most general purpose operating system's do not meet hard real-time scheduling
requirements, but they do try to meet soft real-time scheduling requirements,
such as those required for multi-media programs. Soft real-time scheduling is
where you're expected to respond quickly and keep vaguely in real time, but the
value doesn't drop to zero if you fail to meet them.

*This is done by designating processes as real time processes, giving them
higher priority.*

In Linux, regular users can't make their processes real time. However, to do
this, you must use `chrt`.

## Multilevel Queue Scheduling

The idea of multilevel queue scheduling is that some categories of processes
are more important. For example, batch jobs you want to run FCFS to minimize
waiting time, but interactive jobs you want to run with RR to response time.

How do you determine which level queue a process should go in? You could have
processes tell you, but processes can change and different OSes implement
scheduling differently, so it's hard to do cross platform. We normally schedule
this using *feedback*, where a process moves between the queues.

Feedback is based on aging or process behavior.

For example (aging), new processes may go into a RR queue with 8ms. Then going
to 16ms RR queue. Then going to a FCFS queue. The idea is you bet that the
process won't take much time, giving it a bit more time until it's done. This
would give you a good balance of waiting time and response time.

## Multi-Processor CPU

*Asymmetric multi-processing* is where we treat specific cores differently.
This is more common in *heterogeneous* multi-processor systems, where you have
for example a specific core for sound processing. *Symmetric multi-processing*
(SMP) is where we treat all cores equally. This is very common in *homogeneous*
multi-processor systems.

Processes tend to run faster if they are repeatedly put on the same processor
because of the cache. *Soft processor affinity* is where the OS tries to
schedule processes on the same processors, but is willing to not. *Hard
processor affinity* is where the OS mandates the processes are on the same
processors; this is normally done via request.

## Linux Scheduler

Each CPU core has its own ready queue that it stores in a red-black tree sorted
by virtual runtime. It is a work-stealing scheduler, meaning that a CPU can
steal work from other cores if it runs out of work.

*Virtual run time* is the runtime of the program scaled by its niceness. Less
nice processes get charged less for their time. More nice processes get charged
more.

Per POSIX, Linux has 140 different priorities, with the first 100 for real-time
processes.

# Synchronization

A **race condition** is when the correctness of your program depends on the
order of execution of multiple threads/processes. This normally occurs because
of non-atomic operations / memory getting changed unexpectedly, especially with
shared memory.

*Note:* Having multiple threads read a piece of memory is okay. However, having
one thread read/write a piece of memory and any other thread read (or write)
that same memory is incorrect.

## Classic Synchronization Problems

There are a few standard problems that basically all computer scientists learn
about.

### Bounded Buffer / Thread-safe Queue

A bounded buffer is a multi-producer, multi-consumer queue of elements. If you
want to solve this just using semaphores, it would look something like this

```c
sem emptyCount = BUFFER_SIZE;
sem fullCount = 0;
sem lock = 1;
producer() {
  while (true) {
    Item it = makeSomething();
    acquire(emptyCount); // emptyCount--
    acquire(lock);
    buffer[(first + num) % BUFFER_SIZE] = it;
    num++;
    release(lock);
    release(fullCount); // fullCount++
  }
}
consumer() {
  while (true) {
    acquire(fullCount); // fullCount--
    acquire(lock);
    Item it = buffer[first];
    first = (first + 1) % BUFFER_SIZE;
    num--;
    release(lock);
    release(emptyCount); // emptyCount++
    consumeItem(it);
  }
}
```

### Dining Philosophers Problem

Imagine you have multiple philosophers sitting at a table. They each have a
plate in front of them. Between each plate there is a single chopstick. All
philosophers are sitting there thinking, looking up. Whenever they get hungry,
they grab the chopstick on their left and then later on their right.

*How do you prevent the Philosopher's from deadlocking?* They deadlock when
they all grab the chopstick on their left and thus no one can grab the on on
their right.

Here's a quick list of the solutions, along with comments on them.
* Keep an extra chopstick around: More resources aren't always available.
* Only one at a time can eat: Horribly slow.
* Only pick up a chopstick if you can get both: Might have starvation. Suppose
  the philosopher to your right starts eating and then the one to your left
  starts eating, alternating forever. You never get to eat.
* Break the symmetry, make some pick left first and others right first: Works
  well and is reusable!

### Readers and Writers Problem

This issue is similar to the critical section problem solved with mutual
exclusion. However, solving this problem allows for more concurrency.

Normally, it is safe for multiple threads to read concurrently. However, it is
not safe for one thread to write while there is another thread looking/writing
the memory. Formally, where $nw$ is the number of writers and $nr$ is the
number of readers, it is safe if ($nr = 0$ or $nw = 0$) and $nw \le 1$.

We now implement this using monitor pseudo-code. This implementation has an
issue with *starvation*, where writers may starve because readers can get in if
other people are reading but a writer cannot. We could fix it, but we don't
here.

```nohighlight
monitor ReadersWriters {
  // Number of readers
  int nr = 0;
  // Number of writers
  int nw = 0;

  // Okay to read?
  Condition readable;
  // Okay to write?
  Condition writable;

  void lockReading() {
    while (nw > 0) {
      readable.wait();
    }
    nr++;
    // Other readers waiting should know that
    // it's safe to read. We do this because our
    // pseudo-code doesn't use broadcast
    readable.signal();
  }
  void unlockReading() {
    nr--;
    if (nr == 0) {
      // Don't broadcast because we only want to
      // wake up one writer.
      writable.signal();
    }
  }

  void lockWriting() {
    while (nr > 0 || nw > 0) {
      writable.wait();
    }
    nw++;
  }
  void unlockWriting() {
    nw--;

    // Wake a reader and a writer and let them
    // race.
    writable.signal();
    // We don't have broadcast >:(
    readable.signal();
  }
}
```

### Priority Inversion

Synchronization mechanisms can interfere with priority issues. Suppose you have
some cheap low-priority job that acquires a lock. Then you have a
medium-priority job that is very CPU intensive. Normally, the medium-priority
job will run a lot more than the low priority job. However, suppose then a
high-priority job comes along and tries to get the same lock the low-priority
job got. Now the high-priority job is blocked by a low-priority job and will
have to wait a long time!

*How do we fix this?* Normally, RTOS's (and possible normal OS's) will have the
option for *priority-inheritance*, where the low-priority job will be promoted
to the same level as the high-priority job while it is blocking that
high-priority job.

## Synchronization Mechanisms

Most of the times with memory, you have a *critical section problem*, where you
only have a single section (or a few) interacting with shared memory. To keep
this memory safe from corruption, we put up guards around this critical section
using various **synchronization mechanisms** (a.k.a. primitives).

*Note:* Ideally these critical sections are small and quick.

A good solution to the critical section problem should have the following
properties:
* Mutual Exclusion: We only want one thread in the critical section at a time.
* Progress: Progress will always be made, you never wait forever.
* Bounded Waiting: Can't starve a thread.

### Naive Synchronization

This example may look good, but it will allow multiple threads in if they both
get past the while loop simultaneously and then set that they are inside.

```c
bool inside[2] = {false, false};
someThread0() {
  while(true) {
    while (inside[1]) {}
    inside[0] = true;
    // critical section
    inside[0] = false;
    // remainder section
  }
}
someThread1() {
  while(true) {
    while (inside[0]) {}
    inside[1] = true;
    // critical section
    inside[1] = false;
    // remainder section
  }
}
```

This example solves the problem, but has the issue of deadlock, where they both
say they want in and then wait for the other guy to finish.

```c
bool wantIn[2] = {false, false};
someThread0() {
  while(true) {
    wantIn[0] = true;
    while (wantIn[1]) {}
    // critical section
    wantIn[0] = false;
    // remainder section
  }
}
someThread1() {
  while(true) {
    wantIn[1] = true;
    while (wantIn[0]) {}
    // critical section
    wantIn[1] = false;
    // remainder section
  }
}
```

We could try to resolve it by taking turns (strict alternation) and it works,
but its generally a bad idea because its possible for the threads to not want
to go through the critical section the same number of times and its also
wasteful.

```c
int turn = 0;
someThread0() {
  while(true) {
    while (turn == 1) {}
    // critical section
    turn = 1;
    // remainder section
  }
}
someThread1() {
  while(true) {
    while (turn == 0) {}
    // critical section
    turn = 0;
    // remainder section
  }
}
```

### Peterson's Algorithm

Combining strict alternation with `wantIn`. Essentially, it says "I want in,
but I'll let you go first if its your turn." Most of the time turn isn't
even looked at.

```c
int turn = 0;
someThread0() {
  while(true) {
    wantIn[0] = true;
    turn = 1; // no, after you
    while (wantIn[1] && turn == 1) {}
    // critical section
    wantIn[0] = false;
    // remainder section
  }
}
someThread1() {
  while(true) {
    wantIn[1] = true;
    turn = 0; // no, after you
    while (wantIn[0] && turn == 0) {}
    // critical section
    wantIn[1] = false;
    // remainder section
  }
}
```

*Note:* This may not actually work anymore, since modern processors do not
guarantee that memory writes occur in the same order appeared. This is because
of performance. Because of this, we have various synchronization primitives.

### Counting Semaphores

Counting semaphores are conceptually counts of the number of threads that can
be in the critical section at once. They can be naively implemented the
following. However, most of the time semaphores are implemented by the OS and
are much more efficient (e.g. they don't busy wait).

```c
acquire(sem s) {
  while (s <= 0) {}
  s--;
}
release(sem s) {
  s++;
}
```

Here's how a semaphore would apply to our previous problem.

```c
sem s = 1;
someThread0() {
  while(true) {
    acquire(s);
    // critical section
    release(s);
    // remainder section
  }
}
someThread1() {
  while(true) {
    acquire(s);
    // critical section
    release(s);
    // remainder section
  }
}
```

*Note:* In this class, we'll say you can't start semaphores at negative values.
It varies across libraries.

### Binary Semaphore / Mutex

Binary semaphores and mutexes are similar and perform basically the exact same
operation. Instead of having a count that gets decremented and incremented by
`acquire` and `release`, you just have a boolean flag that either `lock`s or
`unlock`s.

They cover the most common pattern of using a counting semaphore, where you
just want to have a single thread in a critical section.

### Atomic Operations / Spinlocks

Modern processors provide **atomic operations** and most libraries provider
ways to access these ergonomically. Atomic operations are operations that will
always run together and never have *any* instruction go in-between them and
interfere / change things.

Most atomic operations have the mnemonic of *test and set*, where you do some
check and then conditionally change the value.

Atomic operations can be used to implement **spin-locks**. Spin-locks are
essentially good busy waiting, using atomic operations and normally yield after
spinning for a bit.

## Monitors

*Note:* Monitors with condition variables are provably equivalent to
semaphores.

Monitors are easy ways to wrap functions in locks. They ensure that anyone that
wants to call this function first acquires the appropriate lock and releases it
when they're done.

This prevents us from waiting within a monitor. For example, for the bounded
buffer problem, we try to add things through the monitor and no one else has
called it. How do we show we should also block?

The trick is **condition variables**. Condition variables are basically events
that we can either **signal** as happening or **wait** to happen. When you wait
on a condition variable, you give up your lock on the monitor and go into a
queue of people waiting on that condition variable / event.

*Note:* Signaling on a condition variable where no one is waiting has no
effect.

There are two different **policies** for how signaling works.

* Signal and Wait: Whenever you signal, you wait for the thread you signaled to
  start and finish.
* Signal and Continue: Whenever you signal, you continue running until you're
  done with the monitor. The one you woke up gets to run once you're done.
  * Most common!

We use C/Java like syntax for monitors.

```nohighlight
monitor Maximizer {
  // In some languages hasValC and hasVal might
  // be able to be in the same
  condition hasValC;
  bool hasVal = false;

  int largest;
  void submitValue(int val) {
    while (!hasVal || val > largest) {
      largest = val;
    }
    // this only wakes a single thread / waiter
    hasValC.signal();
    hasVal = true;
  }
  int getLargest() {
    if (!hasVal) {
      hasValC.wait();
      // tell anyone else waiting to wake up
      hasValC.signal();
    }
    return largest;
  }
}
```

```nohighlight
// Synchronized stack
monitor IntStack {
  condition nonEmpty;
  Stack<Integer> stack = new Stack<>();
  int popInt() {
    // Must be while because suppose you have
    // three threads A, B, C. B is waiting for
    // something to be pushed. A just pushed
    // something. Then C came in and popped
    // after A pushed, without blocking. B then,
    // having been woke up by A, wakes up and
    // would try to pop from an empty stack
    // (because C stole its element) if there
    // was not a while loop.
    while (stack.size() <= 0) {
      nonEmpty.wait();
    }
    return stack.pop();
  }
  void pushInt(int v) {
    stack.push(v);
    nonEmpty.signal();
  }
}
```

## APIs

### `semaphore.h`

`semaphore.h` is the POSIX semaphore library. It doesn't work on Mac sadly,
although they do compile, so that's cool. There are both named semaphores
`sem_open` (return `sem_t *`) and anonymous semaphores `sem_init` (return
`sem_t`). You must provide them initial values.

* Type: `sem_t`.
* Acquire: `sem_wait`.
* Release: `sem_post`.

### `pthread.h`

Monitors are not primitives, but you can implement them via structs and
functions.

* Monitor: C has no monitor primitives. Instead you use mutexes.
  * Initialize: `pthread_mutex_init(pthread_mutex_t *)` or
    `PTHREAD_MUTEX_INITIALIZE`.
  * Enter Monitor: `pthread_mutext_lock(pthread_mutext_t *)`.
  * Leave Monitor: `pthread_mutext_unlock(pthread_mutext_t *)`.
* Condition Variables: Luckily, condition variables are primitives, but they
  aren't restricted. This uses **signal and continue** semantics.
  * Initialize: `pthread_cond_init(pthread_cond_t *)` or
    `PTHREAD_COND_INITIALIZE`.
  * Wait: `pthread_cond_wait(pthread_cond_t *, pthread_mutex_t *)`.
  * Signal: `pthread_cond_signal(pthread_cond_t *)`.
  * Signal Everyone: `pthread_cond_broadcast(pthread_cond_t *)`.

### Java's `synchronized` Keyword

In Java, every object can be used as a lock and any method can be a lock. The
threads waiting for a lock on synchronized method is called the **entry set**
and the JVM does not guarantee any order. The threads waiting for an object is
called the **wait set** and the JVM does not guarantee any order.

*Note:* Even if you treat an object as a lock, other people may not. You should
thus prefer using synchronized methods over using synchronized blocks on an
individual object instance.

* Monitor: You just put `synchronized` in a method's declaration and
  automatically you acquire the lock before you enter and automatically release
  the lock before you exit.
  * All `synchronized` methods on an object exclude each other. Meaning if you
    have `synchronized a()` and `synchronized b()`, you can't call both `a` and
    `b` at the same time.
* Condition Variables: You call the appropriate methods on *any* `Object`. This
  uses **signal and continue** semantics.
  * Wait: `this.wait()`. This gives up the lock on `this`. *This is why you
    don't want to create other objects just to wait on them*, otherwise you
    wouldn't give up the lock on `this`.
  * Signal: `this.notify()`. Just moves someone from the wait set and into the
    entry set.
  * Signal Everyone: `this.notifyAll()`. Moves everyone from the wait set and
    into the entry set. This is more useful, since Java doesn't give us
    arbitrarily many condition variables. You just use `while` loops normally.

# Deadlock

A deadlock is a synchronization issue where you are prevented from making
process. Formally, deadlock is when you have a set $S$ of processes where every
process in $S$ is waiting to acquire a resource where the desired resource is
held by another process in $S$.

We can help ourselves understand the issue using a **resource allocation
graph**, where you use circles for processes and blocks for resources
containing dots for an instance of that resource. **Request edges** are
directed arrows from processes to resource blocks show desire (but not
ownership) for instance. **Assignment edges** are directed arrows from resource
dots to processes shows ownership.

Processes with request edges are generally *blocked* by the OS and the OS
assigns resources to processes.

There are a few main ways of dealing with deadlock:
* Prevent: Design for no deadlock.
* Detect: Watch for deadlocks and do something to recover from deadlocks.
* Avoid: Regulate process behavior so that they never reach deadlock, even
  though they theoretically good.
  * Think moves ahead in the game.
* Ignore: Just hope for the best and let users deal with it! :)
  * What most OSes use! This is to avoid unnecessary overhead.

## Deadlock Prevention

There are four *necessary conditions* for a deadlock to occur. If you don't
have all of these, you can't have a deadlock.

* Mutual Exclusion: Some resources can only be used by one process at a time.
* Hold and Wait: Processes can have some resources and ask for more.
* No Preemption: OS gets a resource back only when a process is done with it.
* Circular Wait: It's possible to build a cycle of processes.

Which condition can we prevent/remove?

* Mutual Exclusion: The operating system generally doesn't use mutual exclusion
  of most resources. However, this isn't universally possible (e.g. for
  mutexes), so mutual exclusion is impractical to remove.
* Hold and Wait: We could mandate that every process must request all resources
  at startup. However, this yields reduced resource utilization and possible
  starvation (because processes wait on things they hardly need or on things
  that others hardly need), so it is not very practical globally.
  * Remember the "you must pick up both chopsticks at once" for the dining
    philosophers problem.
* Preemption: This actually isn't too bad and is done all over the place (e.g.
  in the CPU, in memory). The issue is that we have to remember the state where
  you left, but this isn't always possible because otherwise you might reach an
  invalid state or waste time.
* Circular Wait: This is the most practical way to implement deadlock
  prevention. You do this by imposing a total ordering on all resource types,
  meaning you must ask for a lower number resource before you ask for a higher
  number resource. You can do this within your own processes, but it isn't
  always practical for the OS for the same reason as hold and wait.
  * This let's you choose the priority of the resource!

## Deadlock Detection

Unlike deadlock prevention, this does not prevent limit the ability of
programs or limit resource utilization (until deadlock).

The pseudo-code for detecting deadlock is as follows:

```nohighlight
While there's some process P where all of P's
outstanding requests can be satisfied:
  Remove all request and assignment edges for P
  (to pretent P finishes without asking for
  more).
If any processes remain:
  You have a deadlock.
  Find cycle(s); the processes among them are
  responsible for the deadlock.
```

Now, how do we resolve the deadlock? We have to kill a process. We could kill a
resource hog, which frees up a bunch of resources, but potentially wastes a
bunch of time; it also means that resource hogs tend to starve. We could kill
the youngest process, which means we waste less energy.

*Why don't OSes use this?* It involves forcible killing of a process, meaning
we wasted a bunch of time by killing an unfinished process. Also, this normally
causes garbage-collector type pauses on our entire system, which isn't great.

## Deadlock Avoidance

*Note:* This is mostly safe state detection.

If done right, this doesn't limit the ability of programs, prevents deadlocks
entirely, and can only somewhat limit resource utilization.

Often, this requires us to know the future (i.e. what the processes might
request). Practically this is done by having the OS mandate that all processes
stake **claims** on certain resources, meaning they may want to acquire them
sometime in the future. If a process doesn't have a claim on a resource, it
can't get an instance of it. Claims are denoted with dashed arrows on the
resource allocation graph. *Note:* Claims are often denoted with a certain
multiplicity.

This requires us define **safe states** and **unsafe states**. Safe states are
where it is impossible to reach deadlock. Unsafe states are where it is
possible to reach deadlock.

When now run a **safe state detector** whenever a request for a resource is
made. This detector ensures that granting the resource keeps us in a safe
state. The algorithm for the detector is called the **banker's algorithm**. It
goes like this

* Pretend like you granted the resource.
* Turn all claim edges into request edges.
* Run the deadlock detection algorithm.

# Memory

We will think about memory as a *linearly addressable array of words* (smallest
addressable unit). Recall memory protection!

For simplicity in this class, we pretend as though memory is split into two
sections: one for the resident operating system and the other for user
programs. We will also pretend as that memory is allocated contiguously we with
a base (start of memory) and limit (end of memory) registers.

We want our programs to not be dependent on where specifically they are loaded.
How do we do this? We do this with specific **address bindings**. Address
bindings describe how we choose the physical memory space the program will run
in. There are a few main ways:

* Compile Time: The compiler chooses the address when it builds. That is, the
  compiler generates *absolute code*.
* Load Time: The memory address is set when the program starts running. That
  is, the compiler generates relocatable code.
* Execution Time: The OS determines where the addresses should be as it starts
  executing.

## Linking

Linking is the process of taking relocatable code and putting it in a single
location and hooking up all libraries. There are two main ways to do this:
**static linking** and **dynamic linking**.

Static linking is essentially where the linker essentially copies and pastes
all the relevant code into the final binary. This is simpler, but does result
in larger executable binaries. It also doesn't allow for updates without
recompiling your project.

{{ figure(src="static_linking.png", title="Static Linking") }}

Dynamic linking is essentially where the linker sets up symlinks to all the
relevant code into the final binary. This is more complicated but results in
smaller executable binaries and allows for updates without recompiling. *Note:*
This doesn't necessarily save space in memory once they're loaded unless you
can share copies in memory (especially if you only use the base and limit
registers are we are assuming). This can leave you in "DLL hell", where your
code suddenly breaks because of silent/undeclared incompatibilities or where
you can't tell what version of the library you're getting.

This can be more sophisticated using **stubs**. Stubs are small little pretend
functions that actually properly link whenever they are first called.

{{ figure(src="dynamic_linking.png", title="Dynamic Linking") }}

## Loading

Loading is where you actually load the library into memory (instead of just
putting it into the binary). There are two ways to do this again: **static
loading** and **dynamic loading**.

Static loading is the most common. When the OS loads your program, it loads
your entire program into memory including your libraries.

Dynamic loading is like dynamic linking for loading. In dynamic loading, your
stubs not only link to the proper library when they are run but they also
actually load/locate the library in memory when it is executed. Likewise, you
have dynamically unload libraries when they are used. This can reduce your
program's memory footprint significantly, especially if you use some large
library only in one place of your program or only occasionally in your program.
It can additionally reduce start up time by not loading all of your libraries
at first.

{{ figure(src="dynamic_loading.png", title="Dynamic Loading") }}

## Swapping

Swapping is the process of move your *main memory* into your *backing store*
(normally disk). You may want to do this if your computer is running out of
memory to run all of its processes.

When the OS detects that it will run out of memory, it will take a stopped
process and move all of its memory to the backing store. Then, when that
process wants to start, it swaps that memory back into main memory, potentially
swapping something else to the backing store.

The biggest cost to swapping is **transfer time**, or the amount of time it
takes to copy as process control block (PCB) to/from main memory.

*Note:* Modern OSes don't always do this for one complete process at a time.

{{ figure(src="swapping.png", title="Swapping") }}

## Making Room for Memory

Maintaining memory is difficult, we need to
* Maintain allocated regions,
* Maintain unallocated regions,
* Reclaim unused regions,
* Efficiently allocate memory to minimize holes, and
* Be quick.

*Note:* Maintaining memory is almost impossible for compile-time binding
because those programs need to be loaded into an exact location. Load-time
binding is much easier because they can fit anywhere as long as its contiguous.

There's a few main methods of figuring out what unused section / hole to
allocate memory $n$ words in. They each have strengths and weaknesses.

* First-Fit: Walk down the list and chose the first hole that's as large as n.
* Best-Fit: Find the smallest hole that's as large as n.
* Next-Fit: ADS
  * Maintains good cache locality.
* Worst-Fit: Find the largest hole.
  * This is good for storing holes in a heap.

As memory is allocated, we get small gaps in the memory between processes, too
small to be useful. This is called **external fragmentation**. If you use
first-fit memory allocation, on average about 50% of the memory you give out
will be lost to external fragmentation.

Sometimes when processes ask for memory, you may give them more memory than
they need. This is because it may be cheaper/simpler to not keep up with the
little extra bit of unused memory. This is called **internal fragmentation**.

*What if we have several allocated blocks that are not very tightly packed and
we want to make them tightly packed?* You can perform **compaction** by moving
them without the process noticing. You have to be very careful with this
because all pointers and memory addresses will become invalidated. To resolve
this, you need *execution time address binding*, often with hardware support.

*Hardware support?* Yes! Instead of the process itself keeping actual
addresses, they can keep addresses relative to some base/relocation register.
Whenever the process uses an address, it is transparently mapped to an actual
address by adding the value of the base/relocation register (or something more
complex). Then the OS just needs to copy the memory and update the relocation
register. This requires...

* Logical/Virtual Addresses: What the user program thinks it runs on.
* Physical Addresses: What address the memory is *really* at, meaningful to
  hardware.
* Address Translation: Runtime conversion from logical to physical address
  (using relocation register).

Address translation is supported by the **memory-management unit** (MMU) and
normally only applies in user-mode.

## Paged Memory

Our base and limit registers which we've been dealing with up until now have
been fairly limited. Let's level them up using **paged memory**. This is a more
sophisticated way of handling address translation. Paged memory isn't
contiguous and is instead broken into multiple fixed-size blocks called
**pages**. Process memory is split up into a sequence of pages physical memory
is split into a sequence of page-sized **frames**.

*Why differentiate between a page and a frame?* Frames are empty places where
you "hang" pages.

{{ figure(src="paged_memory.png", title="Paged Memory") }}

*Why do this?* This virtually eliminates external fragmentation by having
hardware make fragmentation "normal".

Pages are organized into frames using a **page table**. The page table stores
frames indexed by page. Whenever the CPU wants to read memory, it looks up the
frame using the index of the page and translates uses that to translate the
virtual/logical address into a physical address.

Each process has its own page table and it is used by the CPU in user mode.

Here is the algorithm for doing paged memory address translation. *Note:* For
performance reasons, the page size is (almost) always a power of two. That way
we just translate the high order bits using a table lookup and keep the low
order bits, instead of doing arithmetic.

```python
class Process:
    def __init__(self, page_size, page_table):
        self.page_size = page_size
        self.page_table = page_table

    def translate_address(self, addr):
        page_number = addr // self.page_size
        frame = self.page_table[page_number]
        offset = addr % self.page_size
        return frame * self.page_size + offset
```

{{ figure(src="logical_addresses.png", title="Logical Addresses") }}

### Page Tables

How do we implement and store page tables? How big should they be? How do we
tell the hardware where to look for the page table?

Currently, most page sizes are about 4 KiB. Modern hardware can support larger
page tables, but this was common for 32 bit systems. That means, you'd have 12
bits for the addresses within a page and 20 bits for the page number. This
means you'd have about 1 million entries in the page table, where each entry is
at least 20 bits. Since 20 bits is a weird number, we normally give each entry
4 bytes (32 bits) because that makes it much easier to index into the table, so
you don't have to multiply by a weird number (e.g. 3). This means the page
table would take 4 MiB, with a lot of wasted space.

*Note:* The above calculations assume you're using a 32 bit system. On a 64 bit
system, you'd likely have 8 byte page entries and possibly more bits for a page
number.

*Note:* The size of the page numbers don't need to be the same size as the
frame numbers. In other words, the *physical address and logical address don't
need to be the same size*. This will allow you to either overcommit memory
(what we do) or undercommit memory.

To help reduce the amount of wasted space, we use the extra space for other
things. Here's a list of a few common uses:

* Valid/Invalid bit: If the bit is valid, the CPU allows you to access the
  page. Otherwise, you can't.
  * Set by OS.
  * This is useful because it means the OS doesn't have to initialize all the
    memory you "have" and allows you to grow based off of what you use.
* Read-Only bit: True if this process can't write it.
  * Set by OS.
* Modified bit: Whenever a page is written to.
  * Set by hardware.
  * Useful for tracking whether or not we should copy out memory to disk if
    we're doing that.
* Reference bit: Set by hardware whenever page is read/written (referenced).
  * Set by hardware.
  * This isn't set when you make an invalid read/write.
* No-Execute bit: True if process can't execute code on the page. (Your stack
  is normally not executable.)
  * Set by hardware.
  * Used to help prevent buffer overflow, where people write arbitrary code
    into the stack and execute it.

We tell hardware what page we're using using the **page table base register**
(PTBR). This can only be modified in kernel mode, as you'd expect. This is
normally only switched during context switches by the OS.

### Paged Memory Tricks

Using paged memory allows us to do more clever things than just making memory
allocation easier and reducing fragmentation. It allows us to do

* Sparsely Populated Logical Address Space: We can give processes a way larger
  logical address space than physical address space, basically preventing the
  stack and heap to bump into each other.
* Shared memory: Just given processes pages with shared frames. Useful for
  mutable shared memory or shared libraries.
* Copy on write: Only copy things once there are actual changes.
  * Useful for efficient `fork` implementation! `fork` only copies the page
    table and sets the read-only bit on all pages. We set the read-only bit so
    the OS gets notified whenever the child tries to write to the page.
    Whenever they write, we actually copy the underlying frame and make both
    pages in both children writable.

### Page Table Caching

Pages can be incredibly expensive. It doubles the number of memory accesses,
since you always need to look at the page table, and requires the additional
step of address translation.

This can be mitigated using a **translation look-aside buffer** (TLB), which is
a special cache for each CPU core that caches a subset of the page table. The
TLB stores the page table rows using associative memory that allows for
parallel search by page number. In other words, it's a hardware dictionary /
map.

If you can't find the row you're looking for in the TLB, it is called a **TLB
miss** and we have to look up the frame number in the page table. We then save
the just read row into the TLB (sometimes with a few of the surroundings),
removing another row (decided by hardware). If you can find what you want, it's
called a **TLB hit** and you don't have to look at the page table.

{{ figure(src="tlb.png", title="Paging with TLB") }}

*Note:* In class we normally treat the TLB as a write-back cache. It's also
normally a write-back cache.

To measure the performance of the TLB, we have to consider the **TLB Hit
Ratio** ($\alpha$). Then, the **effective access time** is $t_{hit} \alpha +
t_{miss} (1-\alpha)$. We can calculate $t_{hit}$ and $t_{miss}$ using the TLB
lookup time ($t_{tlb}$) and memory cycle time ($t_{memory}$) doing $t_{hit} =
t_{tlb} + t_{memory}$ and $t_{miss} = t_{tlb} + 2t_{memory}$.

We want to maximize the TLB hit ratio so we get good performance. How do we do
that? Using **locality of reference** or, in other words, putting everything
close together so they fall mostly in the same pages.

Since the page table is different between processes, most OS's throw away the
TLB every time there is a context switch, which means that after every context
switch you start anew with the cache. This is one reason why context switches
are so expensive and in-process context switches are cheap.

Alternatively, some hardware marks every TLB entry with a *address-space
identifier* unique to the process and only allows the process with the correct
identifier to access values of the TLB. This let's you preserve the TLB between
switches.

### Making the Page Table Manageable

As we discussed earlier, if we naively implemented page tables with $2^{20}$
entries at 4-bytes each, every process would have a 4MiB page table, which
doesn't scale well, especially considering very few processes actually use it
all.

#### Variable Page Table Size

*Simplest*.

Variable page table size just allows processes to have a smaller page table and
only access certain possible pages. This is normally implemented using a **page
table length register** (PTLR) that tells the hardware the length of the
current page table and then the hardware checks the length on every access.
This is saved and restored on context switch.

This makes growing page tables very problematic because you have to both find
more memory for the frames and the larger page table.

#### Hierarchical Page Tables

*By far most common*.

This resolves the problem of finding contiguous memory regions for page tables
the same way page tables do. *A meta-page table!* (Or a hierarchical page
table.)

To implement this, we break up the page table into page-sized section. This
means we can mark large sections of the page table as invalid and not allocate
memory for them by invalidating a page in the outer page table. Then, we can
easily grow the page table when we need to by allocating a page in memory for
the page table (which then gets pages to fill itself in).

*Note:* Technically at full load, this takes up more memory than a naive
implementation, but that almost never happens.

*Note:* Really, both the inner and outer page table are in the same frames that
normal memory is placed in.

To do address translation, we split up our logical address into three parts
(unlike the normal 2). The highest order bits are for the outer page table, the
middle order bits are for the inner page table, and the low order bits for the
final page offset.

We can actually have more than the 2 levels discussed here! The technique works
for arbitrarily many until the top level table fits in a page.

With multi-level page tables, the TLB becomes increasingly important. This is
because the TLB goes straight from page number (including outer and lower page
number) to the frame number. Thus you can skip each of the levels and go
straight to the frame number, saving two memory accesses (one for outer and one
for inner page table).

*Note:* All page tables except for the outermost one are guaranteed to have the
same page size because they fit as much as they can in a frame. You'd like it
to work out perfectly so that the outermost page table has no wasted space.

#### Hashed Page Tables

Store the sparse mapping from page number to frame number as a hash table. To
handle collisions, you use a linked list on every line of the hash table. Then
the hardware just hashes the page number looks in the list for a match.

#### Inverted Page Table

Since we only have a limited number of frames that doesn't change between
processes, if we build the table backwards, it can be much smaller. This has
more complicated page lookup, but can have decreased storage overhead.

The reason this saves so much memory is because there are often fewer physical
frames than logical pages and you only have a single shared page table for the
entire machine. Because the page table has to be shared, you need to verify the
PID of the process.

This would have a huge performance disadvantage if it weren't for the TLB.

#### Software Address Translation

For more complex address translation methods (e.g. hashed page tables),
sometimes the hardware doesn't support address translation through anything but
the TLB. If it tries to use a page number not in the TLB, it traps the OS and
asks it to do the address translation and put the output in the TLB. This makes
TLB misses way more complicated, but means you can make the page table more
sophisticated.

## Virtual Memory

Previously we talked about swapping entire process's memory to secondary
storage. This was extremely disruptive to the process, not very granular, and
not particularly efficient, because we had to do so much at one time.

We can make this swapping more granular by only swapping a single page at a
time. Here's some terms about that.

* Page out: Copy a page from main memory to the backing store.
* Page in: Copy a page from the backing store into main memory.
* Memory resident: The page is in a frame in main memory.

What are some strategies to do this?

### Demand Paging

We move seldom-used pages to the backing store and bring a page into memory
when processes try to access it. This means processes take much less physical
memory.

This can be **pure** demand paging, where we don't even bother loading pages
into memory until they're first used. This can save I/O at process startup and
allows less physical memory per process, allowing more processes.

*How do we know when we should page in a page when it isn't in memory?* The
trick is we mark the pages that aren't memory resident (on secondary storage)
as invalid. Then when the process tries to access one of these pages, the
hardware traps to the OS and we can figure out if the page actually exists but
just in secondary storage.

While we are paging in the page a process asked for, we block the process on
I/O (since paging in can take awhile!). When the OS is done paging in the page,
the OS updates the process's page table and wakes up the process.

### Page Fault Efficiency

*What if paging in requires we page out another page?* In that case, we call it
**page replacement with a victim**, where the victim page is the page that is
being forcibly paged out. This means page faults / swapping pages can be
**really** expensive because you have to read-in, write-out, and do other
administrative work to do page replacement.

With this knowledge, we can create a formula for our **effective access time**
(EAT), that is how long it takes to access memory on average, where $0 \le p
\le 1.0$ is the page fault rate. `EAT = (1-p)*memory_access_time +
p*(page_fault_overhead + page_out_time + page_in_time + fix_page_table +
memory_access_time)`.

Normally, the amount of time it takes to handle a page fault is at least 5-6
orders of magnitude above the non-page fault memory access time. This means we
***really*** don't want to page fault.

We can't pick what memory the process's ask for, so the only thing that we can
really control to keep our page fault rate low is who should be the victim.
*Note:* We don't have long to think about this because you're the OS!

There are two main policies for picking the victim. **Local** page replacement
policy means that a process will only ever replace one of its own pages.
**Global** page replacement policy means that any page can be the victim when a
process needs to replace a page.

### Page Replacement Algorithms

We test this similar to how we tested process scheduling algorithms. We'll make
up a string of pages used by a "program" and see how various algorithms
perform. The most thing we measure is the number of page faults.

Belady's anomaly occurs when more memory results in worse performance. It can
occur at any level, not just swapping pages. Not all algorithms are subject to
Belady's anomaly, but many are.

Algorithms that aren't subject to Belady's anomaly are called **stack
algorithms**. Stack algorithms are algorithms where the set of pages you keep
in memory is a subset of the set of pages you would have kept in memory if you
had one more page. In other words, more memory always means you'll keep
additional pages in memory but never chose to throw out memory that would have
remained with fewer pages.

#### First-In-First-Out (FIFO) Page Replacement

Always pick the oldest page as the victim.

* Pros:
  * Extremely easy and efficient to implement
  * Only requires work when a page fault occurs. (Normal memory access doesn't
    require updating anything.)
* Cons:
  * Often we have long running processes that are important.
  * Really sucks when we access memory in repeated sequences.
  * More frames can yield more page faults. **Belady's anomaly**.

#### Optimal Page Replacement (OPT)

This algorithm is guaranteed to give you the fewest number of page faults for a
given reference string.

OPT looks into the future by looking at the references after its current
position in the reference string. It then picks the reference that won't be
used for the longest time as the victim.

* Pros:
  * Guaranteed to give you the fewest number of page faults.
* Cons:
  * Requires you know the order of page requests that will occur in the future
    to be properly implemented.

To get around the knowing the future, we use heuristics based of previous
behavior to predict the future.

#### Least Recently Used (LRU)

This is like a backward-looking approximation looking of OPT. The idea is that
pages that have been used recently are likely to be used in the future.

To implement this, you'd probably either keep a timestamp on every memory
reference and then replace the page with the oldest timestamp (okay in hot
path, bad in cold path.) or you could keep a linked list and move the page to
the front of the list (awful in hot path, okay in cold path.) Since this is
hard to implement efficiently, we normally approximate it.

One way to approximate this is to use the hardware-set **reference bit**. The
OS clears the bit every once in awhile to see get an idea on pages are being
used most often. This leads us into the **Second Chance algorithm**.

#### Second Chance / Clock Algorithm

We keep a pointer to the next victim page. When we go to page-out / evict the
victim, we check its reference bit. (We do this even when evicting
uninitialized pages.) If its reference bit is set, we clear the bit and move to
the next page. If the reference bit is set, it is your victim.

This is good because it is free in the hot path and cheap in the cold path.

This algorithm performs better under pressure because it is a better
approximation to LRU the faster it cycles around. So, if it doesn't cycle
around for a really long time, it basically just randomly picks a page to evict
after moving the victim pointer around a lot and clearing a bunch of reference
bits.

#### Least Frequently Used

This utilizes the reference bit like the second change algorithm does. Every
once in awhile the OS goes in and checks the reference bits. If the bit is set,
it increments the pages corresponding count and then clears the bit.

Then, when it needs to evict a page, it evicts the page with the smallest count.

This solution generally has a problem with over-valuing pages that are used
intensively for a short period of time and then not used for a long period of
time. We could however find a way to decrement the counter properly.

*Note:* Sometimes LRU is absolutely awful, even in fairly common places.
Imagine you access pages in the same order, over and over, (e.g. iterating over
a large array) and you have almost enough frames to hold them all. This would
cause you to page fault over and over and over again. Because of this, some
systems implement multiple page replacement algorithms, each with a priority.
When a process starts it uses the highest priority one, but if that keeps
failing then it switches to the next one, eventually even settling for random
page replacement.

#### Additional Reference Bits

This is similar to least frequently used, but it keeps a history of the past
few reference bits. To do this, every page has a reference register or
reference integer. Periodically the OS goes in and right shifts all reference
registers and bitwise ors the current reference bit with the most significant
bit in the register. Then, when it's time to pick a register, it picks the one
with the smallest count.

Here's an example

```nohighlight
0011 1111  # used for awhile but not recently
1100 0000  # idle for awhile but used recently
1100 0110  # used recently and in past
1111 1111  # used all the time
```

This is clever and not incredibly expensive, but it's still fairly expensive
because it has to do the upkeep of occasionally checking. Since page faults
don't happen that often, the additional upkeep and harder choosing process of
this better algorithm normally isn't worthwhile.

### Enhanced Second Chance

This is just second chance except we prefer pages that have not been written
to. We want to prefer this because it means paging out is cheaper, since we
don't need to write the updated page into its copy in storage.
To do this, we look at both the reference bit and the **dirty bit**.

The following table shows the priority of the enhanced second chance algorithm.
It prefers the pages at the top. The reason we prefer dirty pages that haven't
been recently used is because we consider the reference bit to say whether
we'll need to page something back in in the future. If we page out a clean
recently used page, we'll have to page it back in later at a cost of 1. If we
page out a dirty not recently used page, it'll have a cost of 1 as well because
we'll only need to page it out.

| Reference | Dirty |
|-----------|-------|
| `0`       | `0`   |
| `0`       | `1`   |
| `1`       | `0`   |
| `1`       | `1`   |

*How does it make its choice?* As it scans forward, it acts like normal second
chance but it will only accept clean pages. However, while it is scanning it
remembers the state of other pages. If it scans everything and doesn't find a
clean, unused page, it goes through its memory to settle for something else.

### Page Fault Tricks

You can do some things to reduce the cost of page faults.

One method is **page buffering**. To do this, you keep some frames free all the
time. When a page fault occurs, you page your desired page into one of the
available frames. Then, you later page out an idle page to maintain your buffer
/ pool of free frames. *This is like paying in advance.* You basically hope
that some pages won't be missed and your disk will sometimes be free.

Page buffering also allows for **minor page faults**. That occurs when you need
a page that hasn't been used since it was paged out onto disk. Since we didn't
actually overwrite the contents of the page, we don't need to do any I/O and
can just resurrect that old page. (We call "normal" page faults **major page**
faults in this case!) This is kinda like the OS being caught thinking that a
page wasn't used anymore.

Minor page faults also allow for smarted shared libraries. When the process
first tries to access the shared library that it hasn't loaded into its page
table, the OS probably can handle it using a minor page fault if any other
process has the bit of the shared library loaded that we want.

### Thrashing

Thrashing occurs when a process doesn't have enough pages to do the work it
requires. It starts to page fault *a lot* and exhibit low CPU utilization and
abnormally high I/O utilization, leading to an extreme decrease in overall
performance.

*How do we tell the difference between many I/O bound processes and thrashing?*
Normally, you monitor the page fault rate. If page faults are where the
majority of I/O is occurring, then you're most likely thrashing.

*How do we mitigate thrashing?* One way to mitigate thrashing is to implement
local page replacement. That way one process's bad behavior (thrashing) doesn't
spread to the entire rest of the system.

### Local Page Replacement

The most common way to allocate frames for an individual process is to do
**proportional allocation**, where you give each process a number of frames
proportional to its total memory size. However, this has an issue. Process's
need a minimum number of frames or else they have the potential to stop making
process, since one instruction can potentially require many frames at once if,
for example, the instruction spans a frame, the source and destination are in
separate frames, etc. Therefore, OSes that do proportional allocation have a
*minimum* number of frames that they allocate to a process. They want to
allocate more than this minimum in general though for good performance.

*How do we quantify a processes page usage?* We consider the process's
**working set** or the pages it is actively using right now. If we want to
measure the process's working set, we can count the most recent $n$ references
(say 1,000,000). If we can't keep the process's working set in memory, we'll
have very poor performance. In general, processes that have a smaller working
set will have better performance because they are less likely to page fault;
processes that exhibit better *locality of reference* generally have better
performance.

This working set can change though as the program executes, so the operating
system should have a way to adjust its frame allocation policy for a process as
it executes. We normally do this through heuristics, rather than actually
keeping track of the process's working set. A standard heuristic to keep is the
*page fault rate* of the process.

### Page Replacement in Linux 2.4

The kernel maintains the following lists of pages.

* Active list: Pages that aren't (currently) candidates for replacement.
* Inactive lists: Pages that would (probably) make good victims.
  * Clean list: Pages that are identical to a copy on the backing store.
  * Dirty list: Pages that are not (or at least might not be).

Every once in awhile, the kernel processes the active list like second change.
If the page was referenced since it last checked, it increments the age. If it
wasn't referenced and the age isn't 0, it halves the age. Otherwise, it moves
the page to the appropriate inactive list.

Occasionally the kernel will clean pages on the dirty list (i.e. write them out
to the backing store and move them to the clean list). Pages on the clean list
are potential minor page faults and as such are checked before page faulting.

# GPU Programming & CUDA

CUDA is a framework for general purpose GPU programming. CUDA is nice because
it helps factor our hardware differences across GPU models and mix CPU and GPU
code.

CPUs have a few powerful processing elements that are independently
controllable with large caches. GPUs meanwhile have *many* weak processing
elements that are controlled in concert and each doing pretty much the same
thing with small caches. That is, GPUs follow the **SIMD** or single
instruction multiple data design.

*Note:* The cache of GPUs has a different idea of locality, because you want to
consider pixels vertically and horizontally adjacent to be "local".

## Jobs on the GPU

In GPU programming, the CPU (or **host**) is in charge while the GPU (or
**device**) does most of the work. The host executes the serial parts of the
program, prepares jobs for the device, and requests and waits for jobs/grids to
execute. The device actually does the work.

How do you run jobs on the GPU? You create a **block** of threads, each
contains 10-100s threads, with shared memory and limited synchronization
support (e.g. wait for everyone else to catch up). *You can still have race
conditions with shared memory and such like you would normally.*

Because thread blocks have shared memory and synchronization support, there's a
limit on how big they can be. To get around this, we organize blocks of threads
into **grids** or **jobs**, where grids can be multi-dimensional. Each block
has an index within its grid and each thread has an index within its block. It
uses these indexes to determine what computations it's responsible for.

*Why are they organized into grids?* It allows us to better model the idea of
graphics and images and also take advantage of GPUs different cache locality
model. We won't take advantage of that here though.

*Note:* You want to break your kernel up to be as small as possible, even if
you think doing multiple might be better. GPU processing elements are
incredibly weak but they are incredibly parallel.

## CUDA Code

CUDA uses an extended version of the C language (`.cu`), with additional
attributes to mark where the function will run, that way it can properly
compile the code.

```c
// b needs to be in host memory
__host__ void someFunction(int a, char *b) {
  // C code to run on the host (or CPU).
}

// d needs to be in device memory
__device__ void otherFunction(int c, double *d)
{
  // C code to run on the device (or GPU).
}
```

Each thread in a grid executes a **kernel** (no relation to OS kernel). A
kernel is a function that runs on the device but can be called from the host.

```c
// Define a kernel that will execute on the
// device and be called from the host.
__global__ void myKernel(int a, int *bList) {
  // C code for the device to execute.
}

int main() {
  // Call a kernel from the host, asking the
  // device to execute. NOTE: bList must be in
  // device memory
  myKernel<<<blocksPerGrid, threadsPerBlock>>>
  (a, bList);
}
```

To compile CUDA code, you use `nvcc`. `nvcc` presents a similar CLI to `gcc`
and `clang`. Once you compile the CUDA code, you execute it as you normally
would.

## Memory

The GPU has memory which the CPU cannot address. Therefore, we cannot use our
normal memory techniques (e.g. `malloc`). Luckily, CUDA provides calls that are
similar to standard memory allocation calls.

* `cudaError_t cudaMalloc(void **memp, size_t size)`: Fill in `memp` with a
  pointer to the newly allocated block of `size` bytes.
  * Don't dereference the memory in the host!
* `cudaError_t cudaFree(void *mem)`: Free the memory returned by `cudaMalloc`.
* `cudaError_t cudaMemcpy(void *dest, const void *src, size_t size, enum
  cudaMemcpyKind dir)`: Copy memory between the CPU and GPU (either direction,
  specified by `dir`).
* `cudaError_t cudaDeviceReset()`: Remove all device allocations.

## Things We Missed

CUDA has per-thread registers, per-thread local memory, per-grid global memory,
and per-grid constant memory. It also has the `__syncthreads()` barrier within
a block and atomic operations on shared memory.

# Distributed Systems

Benefits of distributed computing:

* Resource sharing: Only need one machine with a certain resource.
* Computational speedup: More hosts mean more power.
* Reliability: Individual nodes can fail, but the system can still operate.
* Communication: Mostly for humans.
* Cost effectiveness: Multiple inexpensive devices are cheaper and easier to
  grow.

Building distributed operating systems are a lot like operating systems. It
could transparently provide resources within the network and perform other
tasks such as:

* Data migration: Transparently move data as necessary.
* Computation migration: Execute computational steps on host with needed
  resources.
* Process migration: Move a whole program while it is running. (Load balancing,
  data access, etc.)

In general, distributed systems need the following properties:

* Scalability: Gradually add resources.
* Robustness: Tolerate failure of individual components.
* Availability: High utilization.
* Heterogeneity: Different types of hosts can cooperate. Differences can
  include different computational speeds, byte order, instruction sets,
  operating system, etc.

There have been a lot of work on distributed computing. Although there is still
much work to be done, we have made some progress.

* Operating systems provide easy access to the network.
* Some distributed file systems do exist.
* Map-reduce for distributed high performance computing has been successful.

## Shareable Network Interface

Much like we built a file system to both make using the storage device easier
and making it so that multiple processes can use the storage device
simultaneously, we build a network interface.

Here's a list of issues this network interface has to handle:

* Indirect Connections: We aren't always connected directly to the host we
  want.
* Unreliable Connections: Messages may be lost or delayed and links may fail.
* Network Congestion: We're sharing the network with other machines on the
  network, so we have to be able to route messages even with antagonists /
  competing applications.
* Changing Network Topology: Devices come online, offline, and switch networks
  all the time.

Normally, to handle all these concerns we split the concerns into layers, where
each layer handles a particular set of concerns.

### Physical Layer

Decides how we will physically connect machines and how we will encode
information (i.e. binary).

Part of Ethernet and part 802.11 (wireless) handles this.

### Data Link Layer

Organizes data into fixed or variable length frames and makes routing decisions
for local networks. Corrects errors introduced by physical layer (normally
using information stored in message header).

The rest of Ethernet and 802.11 (wireless) handles this. Also modem.

### Network Layer

Organize data (frames) into variable-length packets. Adds additional header
information concerning routing data across multiple connections.

The Internet Protocol (IP) handles this.

The Internet Protocol provides a best-effort packet delivery service. Each host
is represented with a 32-bit IPv4 address (or 128-bit for IPv6). Each packet is
stamped with a source and destination address. Basically, you dump a packet
into the network and it tries its best to route it to the destination.

There is no error detection or correction for the payload (only for the
headers). There is no attempt to avoid network congestion.

Congestion may cause packets to be dropped (or more rarely errors) or even
duplicated. Retransmission to recover from lost packets may reorder packets (or
more rarely routing machines).

Individual IP addresses have a structure that allows routers to know who would
know more about the packet. They forward the packet to this node and it
continues until it reaches the destination.

### Transport Layer

The transport layer provides useful application semantics on top of the network
layer. It allows for process-to-process packet delivery (rather than
host-to-host). Breaks (large) messages into packets and reassembles them on
arrival. Creates the illusion of connections for clients, rather than just
spurious packets/messages.

Examples include the Transmission Control Protocol (TCP) or User Datagram
Protocol (UDP).

#### UDP

UDP is conceptually a very thin layer. You don't need to establish a connection
first and messages may be lost. Conceptually, it is just a message queue that
provides error detection within messages and port numbers to dispatch messages
to the right process on the host.

*Note:* Individual messages are called **datagrams**.

Port numbers are 16-bit integers that uniquely identify processes on a host.

To use UDP, you choose a port number and then create a datagram socket for that
port.

*Why is UDP set up?* UDP is very cheap to set up and because of that fast. For
certain services where real-time performance is more important than never
missing a message (e.g. streaming video), this trade off is worth it.

##### UDP in Java

You just use `java.net.DatagramSocket` and `java.net.DatagramPacket`. You
create a `DatagramSocket` on a particular client. You create `DatagramPacket`s,
which have both data and a destination (i.e. IP and port), and have the socket
send these packets to the given destination.

#### TCP

Whereas UDP was a message queue, TCP is a *pipe*. TCP has no message boundaries
(instead just sending bytes) and guarantees that no bytes will be lost or
received out of order. A connection must be established first and reliability
(e.g. packet loss prevention) is achieved by using acknowledgement and a
timeout, retransmitting in the case of failure. It also performs *congestion
control*, where it will slow down the sender if the receivers network is
congested / we're losing too many packets. It slows the sender down by
periodically blocking the sender.

Where in UDP applications where peers, TCP follows a strict client-server
model. The server selects a port, sets up a **server socket** with that port,
then starts *listening* on that socket. A client then sets up a socket and then
tries to connect with the server by sending a message to the server on that
port. The server sends an acceptance of that request and then the client
responds with an acknowledgement. At that point, the server sets up a new
socket that is *just* connected to that client. Now the client's socket and the
server's new socket act like a pipe.

The server gets a new socket to allow the server socket to keep listening for
new connections.

##### TCP in Java

This requires `java.net.ServerSocket` and `java.net.Socket`. The client creates
a `Socket` with the given host and port. The server creates a `ServerSocket`
which is basically a factory for `Socket`s; the server repeatedly calls
`ServerSocket.accept` to generate `Socket`s that correspond to individual
client sockets.

### Application Layer

This is how your application actually communicates and is what you think about
most. It includes things like HTTP, SSH, and DNS.

As the name implies, this is not the job of the OS.

## Remote Procedure Call (RPC)

Often, we don't structure our code as sends and receives. Instead, we think
about code in terms of functions. RPC makes this possible. Essentially, you
have some framework / library that can transparently send and receive network
messages and make them look as though they were executed on the same host like
a normal function (hence transparent).

This is normally done by having a server with a thin client-stub that exposes
all functions the server can perform. This client-stub could even be
auto-generated. Then, whenever you want to do an RPC call, you call the
client-stub that makes a request to the server.

RPC could easily be implemented using UDP using one-off requests which should
be faster (assuming everything works). However, this is dangerous because you
don't know whether the request or the response got lost. In other words, you
don't know whether your function was executed or not. To cope with that, we
want **idempotent** functions or functions that don't have any additional
affect after being called more than once. Alternatively, we could guarantee
that call functions either zero or one times. That is, we don't retransmit
requests.

## Structures for Distributed Applications

### Client-Server Model

One of the oldest and most widely used model of distributed applications is
client-server. You have one server and many different clients. It is *highly
centralized*.

We normally split up applications into layers. A common split is presentation
logic, application logic, database logic, and database management system
(DBMS). We can then decide where we put each layer. Where we want to put the
layers depends on the structure of our application, but here's a list of some
common named splits.

* Host-based Processing: All layers on the server.
* Server-based Processing: Presentation logic on client. All others on server.
* Client-based Processing: Presentation, application, and (some) database logic
  on client. DBMS done by server.
* Cooperative Processing: Presentation logic and some application logic on
  client. Some application logic on server and database logic and DBMS on
  server.
  * Shared computational load!
  * More complex to design.

### Peer-to-peer

There is no server. Everyone is a "client" and shares in part of the
application logic.

Scales very well but often more complicated to design.

### Transactional

Model all application logic in terms of transactions. A users then just makes
various transactions with the system and the system guarantees they are
executed appropriately.

# Protection

For many computing scenarios we want to enforce a certain **policy** on how OS
resources can be used and by who. For example, maybe we don't want everyone to
be able to read certain files or maybe we want to restrict how much a certain
group can print.

Normally, when implementing and designing protection solutions, we talk about
**access rights** (rules) to the **operations** certain users can perform on
given **objects** (resources). *Note:* Instead of saying users, we normally
call the things with the access rights a **protection domain** because
sometimes we deal with groups or programs or other things.

A good permissions system allows for many different types of permission
policies and fine grain control.

## Access Rights

Some common access rights are read, write, execute, append, create, delete,
list (for directories). There can be access rights specific to various objects,
such as printing for a printer. However, this is often handled using the
standard file system access rights. (For example, printing to a printer might
be write permissions.)

Often we conditionally allow domains to give away access rights to other
domains. We may add an additional access right for all normal ones, for example
read* (read star). Here the star means that the domain can give that permission
to other domains (limited copy) or transfer that star access right to another
domain. However, another more often used technique is to consider certain
domains the **owner** of the object. The owner can give away and revoke access
rights as it sees fit.

Another trick that is sometimes used is the **switch** access right to a domain
object. This is used to allow certain domains to temporarily switch to another
domain and use its access rights. However, this leads to the **confinement
problem**, where domains can switch to another domain which has access to
things the original domain shouldn't have access to. Even worse, sometimes this
switch right chain can be hard to find, it is even undecidable if you allow
creation of domains and objects.

*How do we record access rights?*

### Access Matrix

One naive / easy way would be to use an **access matrix**, where every row in a
protection domain, every column is an object, and the internal cells are the
access rights of that domain.

This is extremely memory inefficient because matrices take a lot of memory and
are very sparse. As such, it is very rarely used. However, it is easy to see.

### Access List

* Easy to know who can use an object.
* Easy to remove an object or revoke rights.
* Hard to answer "What can I access?"
* Most common in general.

Basically, you convert each column in the access matrix into a list. Every list
is associated with an object and contains a series of entries, each containing
a domain and its access rights. You omit empty spaces which allows for much
less wasted space.

Each object keeps track of its individual access list (aka column).

### Capability List

* Easy to know what a domain can access.
* Hard to remove an object or revoke rights.
* Hard to answer "Who can access this?"
* Who manages the list??

A capability list is a lot like an access list except that it lists the rows.
Every list is associated with a domain and contains a series of entries, each
containing its object and its access right. You omit empty spaces which allows
for much less wasted space.

Each domain keeps track of its individual capability list (aka row).

### Lock and Key

* Hard to know who can access an object.
* Hard to know what objects a domain can access.
* Easy to revoke access rights.
* Maybe more efficient to represent and give out access rights.

Lock and key is like a mixture of access list and capability list. Every domain
contains a list of keys and every object contains a list of locks. Then, to
find out what your access rights are, a domain matches its key with an objects
lock. We're normally clever, having domains share keys with the same
permissions and having objects use the same keys as other objects.

*Note:* it is permissible for a domain to have multiple keys to the same object
with the same access rights. Basically, it's okay if you have multiple reasons
for accessing an object.

This is good in general because it enables easier revoking of access rights, by
having keys be *reasons* that a domain can access that resource. Then, you just
revoke that key so you don't accidentally take aways a domain's permissions to
an object when it had multiple reasons of using it.

*Note:* There are many different ways to convert an access matrix into a lock
and key system.

*Note:* This is kinda how Unix group ownership works.

## Standard Unix Permissions

Every user has a unique user id. Every user is a member in multiple groups.
Every group has a unique group id.

Permissions are associated with each object. Every object has an owner, group,
and mode bits. There are three mode bits assigned to each of the three domains.
They are read, write, and execute as the permissions mode bits and owner,
group, and other as the domains.

For files, read, write, and execute mean exactly what you'd think. For
directories, read means you can get a listing, write means you can add / delete
files, and execute means you can see file attributes.

Your groups are kinda like a list of keys and the single group for an object is
kinda like a single lock for that object. You have to squint a bit though.

There's also some extra bits beyond the mode bits we normally think about.
There's the setuid bit which means pretend to be the owner while executing, the
setgid bit which means pretend to be the group while executing, and the sticky
bit which means keep this program in memory even when it's not running. The
sticky bit used to be useful to keep commonly used programs in memory for
efficiency, but it's not as important anymore because OS caching has improved
and we have faster computers.

### Syscalls for Unix Permissions

* `fchmod(int fd, mode_t mode)`: Set mode bits of file.
* `fchown(int fd, uid_t owner, gid_t group)`: Set owner and group of file.
* `fstat(int fd, struct stat *buf)`: Fill in `buf` with information about the
  file.

## Permissions and Programs

Most programs are run with exactly the same permissions as you when running. In
other words, the program is you.

Some security techniques such as sandboxing change this by running the program
in a limited environment to help prevent trojan horses and other exploits. The
principle behind sandboxing is called the **principle of least privilege**,
which says we should only give programs exactly the permissions they need and
no more. This helps prevent accidental breakages either from mistakes or
malicious programs. You can do this in a Unix-y way using groups, but that is
limited in terms of how many groups you can have.

To do this truly well, we'd like programs to have some way of dynamically
changing their protection domain. That way, programs could start with as few
permissions as possible and assign certain module / subprocesses of the program
high permissions to allow them to do just what they want to do. For example,
this would allow the init system to have very few permissions but spawn off
higher permission processes.

### Permissions and Java

Java actually has an interesting concept of "trusted" code. By default, code
from your hard drive is considered code, but it is possible that the JVM
downloads code and starts executing it while it is running. In this case, it
considers the downloaded code untrusted and doesn't allow it to do certain
protected operations (e.g. opening arbitrary files).

This is enforced using stack inspection from the `AccessController` class. It
has a `checkPermissions` method which introspects the stack to find out if we
are allowed to do privileged code. It has the `doPrivileged` method, which only
trusted code can execute and marks the current point in the stack as a point
where a privileged operation was allowed.
