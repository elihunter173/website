+++
title = "CSC 236: Computer Architecture & Assembly"
[extra]
teacher = "Dr. Vincent Freeh"
+++

# Views of System

There are two orthogonal views of a system, logical and physical. Logical is
reasoning about function. Physical is reasoning about construction. This class
attempts to analyze a computer using both. Logical view is also the
architectural view.

# Number Systems

Computers, like us, use a positional number system. You already know this, so I
won't go too deep into it, but basically to find the value $v$ of some string
of digits $D$ in some radix $r$ (or base), you do

$$v = \sum_{d_i \in D} d_i * r^i.$$

In this class, we will follow the math standard of postfixing a number with a
subscript of the radix (or base) rather than the standard computer science
prefix. For example, we write $101_2$ rather than $0b101$.

## Unsigned Integers

Unsigned binary integers are pretty simple. All bits (or binary digits) are
value digits.

We represent these without a $+$ or $-$.

### Overflows

What happens if we run out of bits after some operation? Well, we get an
overflow! This means we lose the largest bit. Think about an odometer (or some
other counter) rolling over.

*Note:* Most hardware detects overflows like this, but software doesn't always
pay attention because not all platforms support it.

## Signed Integers

There are many representations for signed integers. The most common is two's
complement, but there used to be a lot of diversity.

We represent these with a mandatory $+$ or $-$.

### Signed Magnitude

*This was used by the Gemini program in NASA.*

The MSB is the sign bit (`0` is positive, `1` is negative), the rest is the
magnitude. You choose the most significant bit normally because that gives the
signed positive and unsigned numbers the same representation for most numbers.

```
0000 0111 == +7
1000 0111 == -7
```

The rules for addition are:
* If the signs are the same, add the digits as if they were unsigned. The
  result has the sign of the operands.
* If the magnitudes are different, subtract the digits of the smaller number
  from the digits of the larger number. The result has the sign of the larger
  number.
* If the magnitudes are the same, the result is zero, either positive or
  negative.

*Why isn't this used?*
* There is $+0$ (`0000 0000`) and $-0$ (`1000 0000`).
* Arithmetic is complicated.

### One's Complement

*This was used by the Apollo program, the PDP-1, and Univac 1100.*

The MSB is the sign bit (`0` is positive, `1` is negative). If the sign is
negative, you invert the bits to get the positive version. *This is really easy
to do in hardware.*

```
0000 0111 == +7
1111 1000 == -7
```

The rules for addition are, to add the binary as if it was unsigned. Then you
do an *end around carry*, where if you have a carry bit, you add one again.

```
 111
  1110 # -1
+ 1110 # -1
  ----
  1100
     1
  ----
  1101 # -2
```

*Why is this good?* Negation and addition is really quick and easy. The end
around carry is simple in hardware.

*Why isn't this used?* It has a positive and negative zero, which have weird
rules. End around carries aren't hard, but still something you have to
consider.

### Two's Complement

*This is used by almost all computers now.*

The two's complement $TC$ for a number with $d$ bits is $N + TC(N) = 2^d$. We
negate a number by taking the two's complement of it. In other words, we solve
for $TC(N)$ to get $TC(N) = 2^d - N$. Solve for that in your done! Luckily, in
hardware there is a very easy way to do this. You just flip the bits and add
one. When looking at the binary as a person, you keep everything to the right
of the first 1, including the 1, and flip everything to the left.

```
0000 0111 == +7
1111 1001 == -7
```

The rules for addition are, just add the binary as if it was unsigned. That's
it!

{{ figure(src="twos_complement.png", title="Two's Complement Wheel") }}

*Why is this used?* It has the all the benefits of one's complement, but it
only has a single 0. Nice!

*How do you detect overflow?* When summing numbers with like signs, the result
should have the same sign. When summing numbers of different signs, they cannot
overflow, since the magnitude is decreasing. In hardware, you just make sure
the sign bit is the same as the carry-out bit.

# Multiplication and Division

Sadly, no one has found out a way to do signed and unsigned multiplication (and
division) with the same instruction.

## Multiplication

Multiplication can get really big. $x$ digits times $y$ digits requires $x+y$
digits. So, how do you multiply two words? It could give you a 32 bit back, in
x86 we handle this by storing the result in a different place and potentially
in two registers.
* `[i]mul byte`: `al * byte = ax`
* `[i]mul word`: `ax * word = dx:ax`

*Note:* `mul` is unsigned multiplication. `imul` is signed multiplication.

For performance reasons, we often to know whether we ended up needing more
space than you were originally used (basically another digit). We store this
information in the carry flag (`CF`), to tell you if the significant part of
the solution outgrew your original data size. (`CF=1` means it did outgrow.
`CF=0` means it did not.) This works because multiplication can never overflow.

Weirdly, you can't multiply by an immediate, only a register or memory value.

## Division

We often care about both the remainder and the quotient, so we store both the
remainder and quotient.
* `[i]div byte`: `ax` is the numerator, `byte` is the divisor. `ah` is the
  remainder, `al` the quotient.
* `[i]div word`: `dx:ax` is the numerator, `word` is the divisor.
  `dx` is the remainder, `ax` the quotient.

*Note:* `div` is unsigned multiplication. `idiv` is signed multiplication.

*Note:* Status flags are not updated by divide.

If you want to convert a word into long / double word, you use the `cwd`
instruction. This acts on `ax`.

You can get a divide overflow by not having enough space for the quotient.
(You'll always have room for the remainder.) If you get a divide overflow (e.g.
by dividing by zero or by dividing something large by something small), DOS
interrupts your program and then terminates it. The way to get around this is
normally either to check your division before you do it or to write an
interrupt handler. *You probably shouldn't do this*.

We won't prove it here, but if the upper half of the digits of the denominator
is less than that of the numerator, then the division will overflow. Otherwise,
it won't. In other words, we want a large denominator to not overflow.

The sign of the quotient acts exactly like you think it would. For the
remainder, you have to deal with negative remainders. Remember that the
remainder is defined as `quotient * divisor + remainder = value`. For example,
the remainder of $-1/5$ is $-1$ because the quotient would be 0.

# Computer Architecture

Modern computers follow the John von Neumann architecture, where there is
*memory*, which holds *instructions* and *data*, and a *processor*, which
executes instructions on data.

*Note:* Most of what a CPU has is actually a cache.

## Anatomy of Instructions

Instructions (and thus assembly) is made up of **opcodes** and **operands**.
Opcodes define what operation you want to perform and operands define what data
you are operating on.

Instructions are normally executed in a **pipeline**, where each step of the
pipeline performs some different operation. Multiple instructions can be in the
pipeline at once, allowing the CPU to execute "multiple things at once".
However, sometimes the pipeline has "bubbles", where nothing is occupying that
spot in the pipeline. This is due to conditional branching primarily. The
hardware can get around this with speculative execution, where it takes a guess
and either trashes the pipeline if it guessed wrong or executes as normal if it
was right. (This isn't important for this class.) A standard, simple pipeline
is fetch, decode, execute, and store.

*Note:* Modern Intel CPUs have complex instruction sets, but they have a
"translator" that converts the instructions into CISC *operations*, which are
actually executed.

There are two main "philosophies" on what instructions the hardware should
provide and why.

### Complex Instruction Set Computer (CISC)

The hardware provides *many* functions natively, having many special
instructions and many address modes. What was used primarily from the 1960s to
1990s. x86 is CISC.

*Why is this no longer preferred?* Instructions have **variable size** and
**variable execution time**. This tends to make it **slower** and **harder to
decode**.

### Reduced Instruction Set Computer (RISC)

The hardware provides *few* instructions natively, only having simple load and
store from memory and the rest operating on registers.

*Why is this now preferred?* Instructions have **fixed size** and have
**fixed execution time**. This makes it **faster** and **easier to decode**.

## Memory Technology

There are a bunch of different kinds of memory which are used at different
times because of their different strengths and weaknesses.

* SRAM (Static Ram): Fast, expensive, uses transistors. Used as part of CPU
  cache.
  * 6 transistors per bit.
  * Access Time: 5-10 ns.
  * ~\$1000/GiB.
* DRAM (Dynamic Ram): Slow, less expensive, capacitors. Used as part of main
  memory. Bunch of types.
  * 1 transistors and 1 capacitor per bit.
  * Access time: 50-150 ns.
  * ~\$10/GiB.
  * Types:
    * EDO: Faster DRAM.
    * SDRAM: Synchronous DRAM.
    * DDR-SDRAM: Double Data Rate SDRAM.
    * RDRAM: Rambus DRAM.

*There's also SCM (storage class memory), which is basically an SSD that is as
fast as RAM.*

## Anatomy of CPU

* Registers: Data held within the CPU. Can be *general purpose* or contain *CPU
  state*.
  * Special Registers (x86):
    * Program Counter / Instruction Address Register (IAR): Address of next
      instruction. By default, it increments after every instruction.
* Arithmetic Logic Unit (ALU): A chip containing circuits which do various
  operations, which the CPU can select.
  * Common Chips:
    * Add
    * Invert
    * Boolean Logic (AND, OR, etc.)
    * Multiply / Divide (less common)
* Instruction Decode Unit (I Unit): Fetches opcode, updates IAR, finds effective address
  (locate data), sends control to E unit.
  * Address Mode: Instructions on how to determine effective address.
  * Effective Address: Actual location of data; provided by address mode.
* Execution Unit (E Unit): Executes provided instruction.

## Memory Bus

*The magic that makes the CPU and DRAM talk.*

* Address Bus (CPU -> Memory): Carries desired memory address from CPU to
  memory.
  * 64-bit computers "can" address $2^64$ bytes, but most only implement
    $2^36$.
* Data Bus (CPU <-> Memory): Sends data to the CPU or to the memory, depending
  on read/write line.
* Address Valid Line (CPU -> Memory): Must be set for memory to send data over
  data bus.
* Read/Write Line (CPU -> Memory): Whether the CPU is writing to memory or the
  memory is sending to the CPU.
* Clock Line (CPU -> Memory): Keeps CPU and memory in sync.

# History

DOS was less of an OS and more of a monitor. The processes it started had
complete control of the computer. DOS would just ask you what you want.

## Software

There were three big players: IBM, Motorola, and Intel. IBM was the biggest and
there were many others.

When the PC age came in, the biggest player IBM bought hardware from Intel and
software from Microsoft. *Why?* It was far cheaper to do since IBM's hardware
was focused on high-quality mainframes.

Motorola had a 16 bit 6800. They decided to make a huge redesign, the 68000,
which was an extremely well designed 32 bit architecture. However, the software
was incompatible.

Intel had a 16 bit 8080. They decided to make an incremental redesign, the
8086, which was a 32 bit architecture that could only support 20 bits of
memory. However, the software was compatible. This ended up making it when.
*How did they make it work?* They used memory segments / blocks to indirect the
desired memory address from the actual physical address.

# Architecture Woes

Computers are complex things that grow and evolve over time. Here's a chronicle
of some of disagreements and compromises that have been made throughout
history.

## Memory Segments

Memory on the 8086 had 20 bit addresses. However, it only have 16 bit
registers. To get around this, we added the concept of segments. *Note:* Memory
segments were a hack to get around limitations.

Segments are 16 byte blocks of addresses, where each segment is a 16 bit
number. We throw away the smallest 4 bits (or last hex digit). To get the
actual address, you multiple the address of the segment by 16 (add a 0 to the
right in hex) and add the offset.

```nohighlight
# Data offset
DS = 0x1234
# Memory offset
memory_address = 0x5678
# Actual address
DS + memory_address
0x1234 * 0x10 + 0x5678
0x12340 + 0x5678
0x179b8
```

We have four different types of segments:
* Data segment.
* Code segment.
* Stack segment.
* Extra segment. (Exists only because we used 2 bits to address segments.)

*Why is this bad?* It's an extra thing we always have to do, which is slow. We
didn't extend the amount of memory a process could have, so if you need that
you need to determine what segment you want, where the segment you want is, and
then load it in.

*Note:* This no longer exists anymore for the most part.

## Endianness

Endianness used to be incredibly important when we had 1 byte or otherwise
small memory buses. It no longer matters as much, but we are still bound by the
legacy decision.

Intel machines are little endian, meaning that the least significant byte is
stored first in memory. The alternative is big endian, meaning the most
significant byte is stored first in memory.

*Why be little endian?* When we get large values into the CPU from memory (i.e.
more than one byte), the CPU expects the smallest byte first. To prevent
jumping around, we store the bytes in memory such that we first see the
smallest byte.

*Note:* This byte reversal only occurs in memory and not in the CPU.

# x86 Anatomy

## Registers

There are 4 general purpose registers in x86, and they are 16 bit (words). You
can replace the `x` with an `h` to access only the upper half (more
significant) half of the register; use `l` to use the lower half.

* `ax`: Accumulator. Default for many operations.
* `bx`: Base.
* `cx`: Count.
* `dx`: Data.

There are also a few special purpose registers in x86, also 16 bit registers.

* `SP`: Stack pointer. Location of top of stack.
* `BP`: Base pointer. Location of bottom of stack.
* `IP`: Instruction pointer.
* `SI`: Source index. For string operations.
* `DI`: Destination index. For string operations.

## Status Flags / Condition Codes

All status flags give you status on the last operation performed. *Except there
are some that don't set the flags.*

* `SF`: Sign flag. 1 means negative. 0 means positive. *This only looks at the
  most significant bit.*
* `ZF`: Zero flag. 1 means last operation was zero. 0 means last operation was
  not zero.
* `OF`: Overflow flag. 1 means overflow. 0 means no overflow. It is set when
  the sign of the two incoming numbers are the same but the result is not.
  * *Checks signed overflow.*
* `CF`: Carry flag. 1 means there was a carry. 0 means there was not.
  * *Checks unsigned overflow.*

# DOS Anatomy

DOS was written for the 8086, which could only address 1MiB of RAM. DOS further
limits this to 640KiB for user programs, of this ~100KiB is used by DOS itself.
The remaining 384KiB are reserved for the ROM, BIOS, and memory-mapped for IO.

The display happens to be assigned to addresses `Bx xxx`. To update the
display, you just write to that part of memory and the hardware handles the
rest.

# Assembly

Every line of assembly is like the following. You don't always have `dest` or
`source` for an opcode. You can always have a label or comment, even if you
don't have an opcode.

```asm
label:
 opcode dest,source ;comment
```
* `label:` An identifier that can be used for GOTOs (or other) later.
* `opcode` Short, human-readable name for an instruction.
* `dest` What the instruction operates on.
* `source` What the instruction gets its data from.
* `comment` A command. Completely ignored by assembler.

There are a few limitations / things you have to get right:
* `dest` and `source` must be the same size.
* You cannot have two memory references.

*Note:* In this class, every line needs a comment and you put block comments in
front of sections.

You can also declare data in memory like the following.

```asm
varname (db|dw) value ; comment
```

* `varname`: An identifier that can be used for later references.
  * Future references must be wrapped in square brackets (e.g. `[varname]`).
* `db`: Declare data to be bytes.
* `dw`: Declare data to be words (2 bytes).
* `value`: An immediate value.

## Address Mode

The address mode describes how the machine should locate the value. Here's a
list of ones:
* Register Direct: Get value from address.
  * Can always be source and destination.
* Immediate: Hard code a value into the binary and use that.
  * Can always be source but never destination.
* Memory Direct: Get value from memory.
  * Can always be source and destination, unless memory direct is both source
    and destination.
* List / Structure: You use a register (`si`, `di`, `bx`, or `bp`) to
  indirectly address some piece of memory.
  * Valid Combinations:
    * Base or index optionally with displacement.
    * Base and index optionally with displacement.
  * Default Segments: You can force the segment you want by prefixing the index
    with a certain segment register (i.e. `cs:[si]`).
    * Data Segment: `si`, `di`, `bx`.
    * Stack Segment: `bp`.

## Instructions / Opcodes

* `mov`: Copies source into destination.
  * Cannot move immediate into segment register.
  * Cannot move between segment registers.
  * Does not set condition code.
* `add`: `dest += source`.
* `sub`: `dest -= source`.
  * Due to the way hardware implements subtraction (inverting and then adding),
    the carry flag "shouldn't" be set the way you expect. However, Intel
    engineers made it so it is set how you'd expect.
* `inc`: Increments `dest`, without setting the carry flag. It doesn't set the
  carry flag because inc is most often used for iteration, so you may want to
  keep the carry information from a previous loop. It's also unlikely that
  you'll has signed overflow from incrementing.
* `cmp`: `dest - source`, throwing away values but sets flags.
* `jmp`: Unconditional jump to `dest` as an instruction address. This normally
  jumps to a label or an offset, which are things provided by the assembler.
  * Just slaps `dest` into the instruction pointer (`IP`).
* Conditional Jumps: There a large collection of different opcodes that check
  all the different flags we have. To use them, you must first do some
  arithmetic (normally `cmp`) and then use the appropriate conditional jump.
  When the condition is true, they jump; otherwise, they fall through.
  * You can look on the class website (notes 6-16).
* `int`: Triggers interrupt identified by `dest`. `21h` is the `dest` for DOS
  syscalls. DOS looks for the syscall ID in `ah` and the arguments in `al`.
  * **NOTE:** All DOS syscalls may use `ax` register. This is actually the
    cause of the *NT bug*, which was when a bunch of assembly programs broke
    when NT started using the `ax` register for the write syscall and didn't
    previously.
* `loop`: Decrement `cx` and jump if `cx` isn't zero. Preserves condition
  codes.

```asm
speed db ??? ; speed in mph (unsigned byte)

; Go to trouble if speed is greather than 55mph
cmp [speed],55 ; Check speed (speed - 55)
ja trouble  ; ja because unsigned >
```

### Syscalls

DOS decided to make `21h` be the interrupt for DOS syscalls. There are a bunch
of syscalls, but all of them send/receive information via the `al` register and
are identified in the `ah` register.

```asm
; Read character from stdin into al register
mov ah,8
int 21h
; Write character to stdout
mov ah,2
mov al,'a'
int 21h
```

## Immediates

The machine has no concept of negatives. Instead, it must be managed by the
programmer.

Our assembly has no special marker for immediates. You just write a number. You
can prepend the number with a `-` to mark it as two's complement negative. You
can append the number with a `h` to mark it as hex.

If you have multiple immediates separated by commas, they become a list.

If you wrap a character with `'`, then it gets encoded to ASCII. If you wrap a
string with `'`, then it gets encoded to ASCII as a list.

## Directives

Directives are commands to the assembler, not the machine. All directives in
this class look like `.name`.

* `.model`: What memory model for the assembler to use. For DOSBOX, we use
  `.model small`.
* `.8086`: Only use 8086 instructions.
* `.stack`: How many bytes for the stack segment to hold. For DOSBOX, we use
  `.stack 256`.
  * You could manually change the stack segment register, but that's more
    complicated.
* `.data`: Marks start of data segment. This is where you can define the data
  as described earlier. *Optional.*
* `.code`: Marks start of code segment. This is where you can define the
  instructions as described earlier. Technically optional, but why would you
  not want it?

## Casting

To down-cast numbers, you just throw away the bits. To up-cast unsigned
numbers, you just put zeros in front. To up-cast signed numbers, you extend the
sign bit.

The hardware doesn't provide a direct instruction for unsigned up-casting
because is easy. Since signed up-casting is more difficult, there is an
instruction to *convert byte to word* (`cbw`), but it only works on `ax`.

```asm
; Signed Up-Casting
.data
a db 255
b db 1
c dw 0
.code
 ; [c] = [a] + [b]
 mov al, [a]
 xor ah, ah
 mov bl, [b]
 xor bh, bh
 add ax, bx
 mov [c], ax
```

```asm
; Unsigned Up-Casting
.data
a db -1
b db 2
c dw 0
.code
 ; [c] = [a] + [b]
 ; Cast [a] to word
 mov al, [a]
 cbw ; ax = FF FF
 ; We shift [a] to bx since cbw only works on ax
 mov bx, ax
 ; Cast [b] to word
 mov al, [b]
 cbw
 ; Add them
 add ax, bx
 mov [c], ax
```

## Basic Example

The first thing you do (normally) in your assembly program is set the data
segment and sometimes the extra segment. *The code segment and stack segment
are set by the OS.*

Identifiers that start with `@` are "injected" into the code by the OS loader
at load time.

*Note:* DOS makes `21h` a syscall. The identifier for the desired syscall goes
in `ah` and the return is in `al`.

```asm
.data
a db 10
b db 55
c db 0

.code
start:
  ; Set up the data segment (DS). We cannot move
  ; immediates into segment registers per the
  ; machine design.
  mov ax, @data
  mov ds, ax

  ; C = A + B
  mov al, [a]
  add al, [b]
  mov [c], al

exit:
  ; syscall: ah = service code: al = return code
  ; 4c = terminate
  ; 00 = 0 return code
  mov ax, 4c00h
  int 21h

; Mark end of source code and give it address
; of first instruction. This is not an
; instruction, although it looks like it.
end start
```

## Indirect Addressing

You can use the following registers as index/pointer registers. All others are
invalid because of hardware limitations.

* `si`: Source index. In data segment. Program data.
* `di`: Destination index. In data segment. Program data.
* `bx`: Base register. In data segment. Program data.
* `bp`: Base pointer. In stack segment. Subroutine arguments.

Here's a quick example.

```asm
.data
list dw ... ; Values to sum

.code
; let mut sum = 0;
; for i in 0..9 { sum += list[i] }
start:
 ; set up data segment
 mov ax, @data
 mov ds, ax

 xor ax, ax ; ax = 0
 mov cx, 10 ; cx = 0
 mov si, offset list  ; si = &list
calc:
 add ax, [si] ; ax += *si
 add si, 2 ; si++ (because dw has a size of 2)
 loop calc ; do { ... } while (--cx != 0)
```

You **must** be careful with how you compare indirect addresses with immediates
(and anything else) because **the assembler cannot tell** whether you want to
treat the indirect address as pointer to a byte or pointer to a word. (This
ambiguity doesn't exist for using direct addresses with things of known size.)
To get around this, you prefix the indexing with `word ptr` or `byte ptr`. This
just tells the assembler what instruction to produce.

## Subroutines

Subroutines encompass procedures, functions, and methods.

Compilers has **linkage conventions** (or ABI), where they expect subroutines
to be called in a certain way and to be set up in a certain way. You must write
your subroutines or subroutine calls following these conventions if you want a
high level language (HLL) to be able to call the subroutine or for you to be
able to call a HLL's subroutines.

*Why use subroutines?* Subroutines are self-contained and reusable, which is
great software development.

*Why not use subroutines?* Calling subroutines can be more expensive than just
in-lining the subroutine and you have to develop conventions, which increases
complexity. (Compilers can easily mitigate this.)

There's a few common protocols. They're mostly split up by different concerns
that can be combined freely.

* State Management:
  * Subroutine stores, the called subroutine saves and restores all registers
    it modifies except for its returns.
  * Caller stores, the caller of the subroutine saves all the registers it
    cares about and returns them.
  * Efficient but easy to mistake, the caller saves only the live registers
    that the subroutine modifies.
* Parameter Passing:
  * Use registers, simple but limited.
  * Share global variables, incredibly hard to track. **Do not use.**
  * Pass on stack, highly recommended and used by most HLLs.

Since x86 is a CISC, it has a `call` and `ret` instructions. `call` pushes the
next instruction's address onto the stack and jumps to the given label. `ret`
pops a word word off of the stack and jumps to that as if it were the address
of an instruction. (Normally you use `call` and then `ret`.)

Similarly, it has a `push` instruction which puts a value on the stack and
updates the stack pointer (`sp`). You could do this manually, but it is slower.

### Multiple Files

As you know, programming everything in one file can get really annoying.
However, when we have a subroutine defined in a separate file, how can the
assembler find it when its assembling our file?

*It can't!* The trick is we have to say that the subroutine's label is external
via `extern <LABEL>` in the main file and mark the labels as `public <LABEL>`
in the subroutine file. When the assembler sees this, it will generate a symbol
table and the linker will make sure that link all the object file's symbol
table's together. If it can't find some symbols, it fails, but if it can find
all the symbols then it properly links them all together.

```asm
; main.asm
.model small
.8086
.stack 256

extrn subroutine

.data
foo dw 8

.code
start:
 mov ax, @data
 mov ds, ax

 mov cx, 10 ; Some personal data
 mov ax, 6 ; Arguments
 push cx ; Save cx
 call subroutine
 pop cx ; Recover cx

exit:
 mov ax, 4c00h
 int 21h

end start
```

```asm
; subroutine.asm
.model small
.8086
; DON'T REDEFINE .stack

public subroutine

subroutine:
 mov cx, 123 ; Trash cx
 mov ax, 5 ; Return value
 ret

end ; NO START ROUTINE
```

### Putting Assembly and HLLs Together

To write assembly for a high level language (or a specific compiler), you have
to conform to the language's API. This is because the compiler generates things
in a certain way and the assembly needs to look like the compiler expects.

For C, subroutines are called by pushing arguments to the stack (in reverse
order) and functions with name `<name>` become subroutines with name `_<name>`
(i.e. they prefix the name with an underscore). Additionally, the callee is
responsible for saving `bp`, `si`, `di`, `ss`, and `ds` while the caller is
responsible for all others.

*Why does C specify that you should push the arguments in reverse?* It is
because C functions can have variadic arguments.

For the subroutines to get the arguments off the stack, the subroutine has to
look back into the stack. This is done by copying the stack pointer to the base
pointer and looking up a known offset to the subroutine. *If you're not pushing
anything in your subroutine, you don't actually need to copy the stack
pointer.*

```asm
; int rc = asmprint('x', 5);
main:
  ; Push the arguments onto the stack. C does
  ; this in the opposite order because it means
  ; adding arguments
  mov ax, 5
  push ax
  mov al, 120
  push ax
  ; Make the call
  call _asmprint
  ; Pop the arguments you pushed onto the stack
  add sp, 4
  ; Retrieve the return value, returned in ax
  ; by convention
  mov [rc], ax

_asmprint:
  push bp
  mov bp, sp
  ; 4 to skip the IP pushed by call
  mov dl, [bp + 4]
  ; 4 to skip the IP pushed by call
  mov cx, [bp + 6]
  mov ah, 2 ; Plan to read
asmprint_loop:
  int 21h
  loop asmprint_loop

  ; Set return value
  mov ax, 0
  pop bp
  ; We'd have to pop stuff off the stack if we
  ; had pushed
  ret
```

**Security Note:** Whenever you make a call to a subroutine within a subroutine
your arguments are visible to the subroutine.

*Note:* Since 64-bit Intel chips released 8 general purpose registers, C
started passing arguments in these registers. It tried to put the first 6
arguments in the double word registers.

## Stack

On the 8086, the stack grows downwards and by units in words. The stack pointer
(`sp`) points to the start of the stack, getting decremented by 2 whenever its
pushed and incremented by 2 whenever its pushed.

If we want *re-entrant* code (i.e. the subroutine can be called as many times
as you want concurrently), you aren't allowed to store any values explicitly in
the data segment. (Imagine if you made a recursive call to a function that
stores values in the data segment.) To get around this, you put local variables
in the stack, at a certain offset down from the current stack frame (normally
`bp`).

# Anatomy of Machine Code

*Note:* Use the table in the course notes for the test.

On the 8086, instructions are variable sized and can be 1 to 6 bytes. Here's
the breakdown. Each block is a byte and the numbers within the bytes are bits.
You don't need every byte for all instructions.

{{ figure(src="machine_code_anatomy.png", title="Anatomy of x86 Instruction") }}

* Code (1 byte): What is actually being executed. Always needed.
  * opcode: What to execute.
  * d: Data direction (0 = reg rc, 1 = reg dest).
  * w: Data size (0 = byte, 1 = word).
* Addr (1 byte): Expands opcodes and describes operands. Needed for certain
  opcodes (see table).
  * mod: Mode.
  * reg: Register or special code.
  * r/m: Register/memory.
* Disp (2 bytes): Memory offset for variables. Needed if you have a memory
  operand.
* Data (2 bytes): Immediate data. Needed if you have an immediate operand. If
  you have byte immediate memory, only use the low byte.

*Note:* `al` is the byte accumulator. `ax` is the word accumulator.

# Boolean Algebra and Computer Hardware

There are certain bitwise operations that are **atomic**. That means that they
can be used to construct every other operation (e.g. AND, OR, etc.), which can
then be used to generate addition, subtraction, and everything! NAND is the
standard atomic operation.

x86 has boolean instruction / bitwise operations:

* `not ax`
* `and ax, bx`
* `or ax, bx`
* `xor ax, bx`

x86 also has shifts, both left and right and both arithmetic and logical.
Arithmetic fills in with the sign bit on the left. Logical always fills with
zeros. Both of them shift the bit out into the carry. You should use
*arithmetic* for signed numbers and *logical* for unsigned numbers.

* `shl ax`: Shift logical left. *Multiply by 2.*
* `shr ax`: Shift logical right. *Divide by 2.*
* `sal ax`: Shift arithmetic left. (Actually same as logical left! Just clearer
  to people)
* `sar ax`: Shift arithmetic right.

All shifts always round down, meaning `sar -5` yields -3, because -5/2 is -2.5.
This means constantly arithmetically shifting right a negative number will
yield -1.

Similar to shifts are rotations. They are identical to shifts except that the
bit shifted out is the same as the bit shifted in. *The carry bits are still
set the same.* There is no arithmetic vs logical rotating. It's just rotating.

# ARM Assembly

ARM (Advanced RISC Machine) is designed and licensed by a British company ARM
Holdings. They don't actually manufacture any chips, just design them and
license out the designs.

ARM processors are widely in embedded contexts due to their low power usage.
Because embedded systems can vary so widely, there are variants on ARM assembly
designed to make certain tasks easier.

## General Design

ARM is a load and store machine. That is, all data processing is done in
registers, so to manipulate memory variables you must load them into a register
and then store them out once you're done.

All instructions are 32 bits in length and almost all instructions execute in a
single cycle.

Instructions can be conditionally executed without jumps. That is, only perform
this when this.

Instructions can optionally set the condition codes. It is up the developer /
compiler to decide.

## Programming Model

Memory address space is 4 GiB (i.e. 32 bit address space) and there are three
data sizes, listed below, that can both either be unsigned or signed two's
complement. There are also 16 general purpose registers, 3 of which have
special meaning (but can still be manipulated normally). There's an additional
status register that stores the flag.

* Data Sizes:
  * Byte: 8 bits.
  * Halfword: 16 bits.
  * Word: 32 bits.
* Registers:
  * r0, ..., r12: General purpose.
  * r13 (SP): Stack pointer. (Same as in x86 terms.)
  * r14 (LR): Link register. Where the return address to a subroutine is
    stored. In x86 all return addresses are on the stack. In ARM return
    addresses can be put on the stack in software (and often are), but for the
    machine it has to be in LR.
  * r15 (PC): Program counter. (Instruction pointer in x86 terms.)
  * Status Register: Where execution flags are stored. Here's a brief listing.
    You can find more on the class website.
    * N: Sign. (0 = positive, 1 = negative)
    * Z: Zero. (0 = zero, 1 = not zero)
    * C: Carry.
       * On addition, this acts the same way as x86, where the carry flag is
         just the carry out of the addition.
       * On subtraction, this is the opposite of the x86. The borrow flag does
         not match real subtraction and instead matches the complementary
         addition.
    * V: Signed overflow. (0 = didn't occur, 1 = did occur)

## Instructions

### Load and Store

Loading and storing is done much differently than in x86, where it was just
`mov`. Here's a list of some of the different operations. `rd` is the
destination, `rn` is the first source, and `rm` is the second store. Almost
every load has a corresponding store, except for loading constants of course.

*Note:* We only list `ldr` and `str` here. These operate on unsigned words.
There are different versions of load and store with different suffixes that
operate on halfwords, bytes, signed, etc.

* Loads: Load a value into `rd`.
  * `ldr rd, =var`: Assigns address of variable.
  * `ldr rd, =const`: Assigns constant.
  * `ldr rd, [rn]`: Assigns value pointed to by `rn`.
  * `ldr rd, [rn, rm]`: Assigns value pointed to by `rn + rm` (sum of registers).
  * `ldr rd, [rn, #n]`: Assigns value pointed to by `rn + #n` (register with
    offset).
  * `ldr rd, [rn], #n`: Assigns value pointed to by `rn` and then post increment
    `rn` by `#n`. (Useful for iteration.)
* Stores: Store the value of `rd` into something. **The destination is the
  second operand.**
  * `str rd, [rn]`: Store into memory pointed to by `rn`.
  * `str rd, [rn, rm]`: Store into memory pointed to by `rn + rm` (sum of registers).
  * `str rd, [rn, #n]`: Store into memory pointed to by `rn + #n` (register with
    offset).
  * `str rd, [rn], #n`: Store into memory pointed to by `rn` and then post increment
    `rn` by `#n`. (Useful for iteration.)

### Conditional Execution

In ARM, many instructions can be executed conditionally. To make an instruction
conditionally executed in assembly, you must prefix your instruction's mnemonic
with the conditional flag that you want.

```asm
; calc abs(r4)
mov r0, #0 ; Set r0 to 0. Necessary to negate r4
cmp r4, #0 ; Test value in r4
submi r4, r0, r4 ; if neg, r4 = 0 - r4
```

You can look at the class notes to see what specific instructions can be
executed conditionally and what the suffixes are for each condition code.

For instructions that can optionally set the condition codes (e.g. `add`,
`sub`), you must suffix the instruction mnemonic with `s` if you want to update
the condition codes. When you combine this suffix with conditional execution,
you put the `s` after the conditional execution suffix.

*Why would you want to do this?* It improves performance for pipelined
machines. In a pipelined machine, instruction execution is divided into stages
where instructions are passed from stage to stage. This allows multiple
instructions to be executing in parallel. In pipelined machines, conditional
jumps cause "bubbles" in the pipeline, because you can't determine whether you
should jump or not until that instruction has gone through the entire pipeline.
This can be mitigated using speculative execution, but that still has a cost if
you're wrong.

With conditional execution, there is no pipeline draining and much less
pipeline "bubbles". Suppose we have a pipeline with 4 stages. If we did a
conditional jump, we'd have a bubble of 4 instructions if we used a conditional
jump. With conditional execution, we have a bubble of 1 instruction. (Well,
really the instruction would just happen to be "wasted". We'd still work on
it.) And we have no bubble at all if we actually execute the instruction.

*Note:* These pipeline bubbles occur when the machine starts the pipeline with
something it didn't need and must subsequently "drain" the pipeline if it
realizes it was wrong.

### Immediates

Immediates have some weird rules about them in ARM. Since all instructions are
32-bits and some bits are needed for the opcode, destination register, and
other things, not all 32 bits of the instruction are available for immediates.
In fact, only 12 bits are available.

To extend the range of immediates allowed, ARM splits up the space for
immediates into 8 bits for the value and 4 bits the rotation amount. When
accessing an immediate, the machine reads in the 8 bit value and then rotates
it right (`ROR`) two times the rotation amount.

This means any 0-255 value can be generated with a rotation amount of 4. Any
multiple of 4 less than $4*255$ can be generated using a rotation amount of `F`
(i.e. 30), because rotating a 32 bit field 30 times right is equivalent to
rotating left 2 times which is equivalent to multiplying by 4. These rules
follow similarly for other rotation amounts. (It's kinda annoying to think
about rotating right, so normally we just consider rotating left and convert
the value.)

*Why did they make it this complicated rule?* It vastly extends the range of
immediates allowed, means every immediate you want possible to create out of 2
immediates, is really easy to do in hardware, and assemblers and compilers had
gotten sophisticated enough at the time of ARM to understand the rules.

Okay, well, how do assemblers handle this? If you do something like `ldr r0,
=999`, the assembler will create a memory variable containing `999` and then
convert that instruction into a load from memory. If you do something like `add
r2, r1, #999`, you're just told you can't do that. *Why doesn't the assembler
handle this case?* Because you need an additional instruction to handle this
and if the assembler generated additional instructions from each machine
instruction then it is no longer a one-to-one mapping, which is valuable for
assembly.

### Subroutines

ARM provides several instructions for ergonomically dealing with subroutines.
In general, storing the return address is called **linking** and jumping to
different addresses is called **branching**.

* `bl label`: Branch and link to label. Saves the next `ip` as `lr` and then sets `pc` to `label`.
  * Basically `call` from x86.
  * This can be conditionally executed.
* `stmdb sp!, {regs..., lr}`: Store multiple decrement before use. The `!`
  causes the stack pointer `sp` to be updated. It stores the registers in
  brackets on the stack and decrements the stack pointer before it is used.
  * Make sure that the link register `lr` is the return address.
* `ldmia sp!, {regs..., pc}`: Loads multiple increment after use. The `!`
  causes the stack pointer `sp` to be updated. It loads values off the stack
  into the registers in brackets and then increments the stack pointer after it
  is used.
  * Make sure that the program counter `pc` is the last address so we jump back
    to the link register.

```asm
main:
  ldr r1, =n  ; r1 points to n
  ldr r0, [r1]  ; r0 = n
  bl sqrt  ; call subroutine

sqrt:
  stmdb sp!, {r1-r3, lr}  ; save r1-r3 and
  ; link regiter

  ; Trash the registers
  ldr r1, =27
  ldr r2, =11
  ldr r3, =100
  ; Load the hardcoded result
  ldr r0, =25

  ; restore r1-r3, load the pc with the original
  ; link register
  ldmia sp!, {r1-r3, pc}  ;

.data
n: .word 625
n: .word 0
```

### x86-like Instructions

These instructions have strong parallels to ones in x86, so we won't dedicate
an entire section to each of them.

* Move: Move is much more limited in ARM. It can only deal with registers and
  (limited) immediates. You'll generally don't want to use these because most
  assemblers only have the sophisticated immediate resolving for `ldr`. Also,
  you should rarely be copying registers around.
  * `mov rd, rn`: Copy `rn` into `rd`.
  * `mov rd, #n`: Move limited constant `#n` into `rd`.
* Arithmetic: Unlike in x86, the destination doesn't need to be a source. In
  ARM, we can "save" the variables if we'd like.
  * `add rd, rn, rm`: `rd = rn + rm`.
  * `add rd, rn, #n`: `rd = rn + #n`.
  * `sub rd, rn, rm`: `rd = rn - rm`.
  * `sub rd, rn, #n`: `rd = rn - #n`.
  * `cmp rd, rn`: Calculates `rd - rn` and sets condition code.
  * `cmp rd, #n`: Calculates `rd - #n` and sets condition code.

## Data Format and Labels

*Note:* These are specifics of ARMSim syntax, but ARMSim syntax is closely
related to other assembler's syntax (e.g. GNU Assembler), so this should be
closely or direcly applicable.

In ARMSim, data declarations and label declarations both end in a colon. Here
is some example data declarations

```asm
v1: .skip  4  ; Reserve 4 bytes
v2: .word  1000  ; 32 bit word
v3: .word  0x000003e8  ; hex
v4: .hword 555  ; 16 bit half word
v5: .byte  10  ; 8 bit byte
v6: .byte  -10
v7: .asciz "ABC"  ; Null-terminated ASCII string
v8: .ascii "DEF"  ; ASCII string
```

Like in MASM, we can define immediate aliases (basically constant numbers)
using the following syntax.

```asm
.equ SWI_Open, 0x66 ; Open syscall
```

Instead of using the `.code` directive to show that the instructions / program
is starting, you use the `.text` directive, since code goes in the text
section.

# Java Virtual Machine (JVM)

Somewhat surprisingly, people have written assemblers for the JVM, assembling
your program to JVM bytecode. One example is
[Jasmin](https://github.com/Sable/jasmin), although it is very old now. *Why?*
It allows you to more easily test the security and capabilities of the JVM,
since you don't have to the securities of the compiler.

Recall that Java was initially created for running on networked embedded
devices (e.g. PDAs and VCRs). This is important for understanding the design of
the JVM.

How do you execute JVM byte code? There are 4 main ways.

* Interpreter: Reads the byte code and executes the corresponding machine code.
* Naive JIT (Just-in-Time) Compiler: Whenever we call a method, compile it to
  machine code and execute.
* Monitoring JIT Compiler: Start out interpreting monitor program activity. JIT
  compile the parts that are executed often or otherwise considered beneficial
  to compile.
* Hardware: Some companies (e.g. AJILE) created hardware that actually targets
  JVM byte code as its machine code.

## Instruction Architecture

The JVM is a stack based architecture. That means only the push and pop
operations actually have operands (their data) and everything else implicitly
gets its data from popping things off the stack and pushing the results back
onto the stack.

*What is good about the JVM being a stack machine?* It allows for compact
instructions. It is agnostic to the registers of the machine. It allows for
simpler interpreters.

*What is bad about the JVM being a stack machine?* It requires more
instructions to do basic things. Some operations become more difficult.

The JVM uses variable length instructions.

The JVM is super-optimized for programs with 4 variables, optimized for 256
variables, and bad for up to 65536 variables. *Why?* The original purpose of
Java was to be on embedded devices, which don't have programs with large
amounts of data.

*Wait, how do these optimizations work?* Java stores all variables in a single
local variable array, where variables are uniquely identified and referenced by
an integer.

## The JVM and History of Caching

If you count what JVM instructions are normally executed, most are pushes and
pops. In fact, there are far more pushes than pops because arithmetic
operations have implicit 2 pops and 1 push that isn't counted. About 8% of
instructions executed are branches/jumps (for variable checks and loops).

Looking at this information, it means a jump occurs about every 12 instructions
($1/12 \approx 8\%$), meaning most loops are about 12 instructions. This helped
hardware designers know that caches are extremely beneficial because it means
programs exhibit strong **locality of reference**, since programs that loop
often execute the same instructions and work with contiguous arrays. This
locality of reference means we can get cache hit rations of 90+%, meaning they
are extremely valuable.

This should make sense to you as a programmer because most programs follow the
pattern where they set up some data, loop for awhile, and then go on to another
loop.

## JVM Calling Conventions

Since Java is a stack based architecture, we pass arguments to
subroutines/functions on the stack is more difficult. This is because passing
them on the stack would mean we can only load the arguments on top of the stack
or we would have to pop them all off the stack and load them into local
variables, which is inefficient.

To make this more efficient, the caller puts the arguments onto the stack and
then the subroutine's local variables array is made to overlap with the
arguments in the caller's stack, meaning the subroutine doesn't need to copy
any of the arguments and instead gets them for free.

For returning variables, Java guarantees that functions will only return one
thing and that it is on top of the stack.

# Microcode

On RISC machines, every instruction maps almost directly to an actual circuit.
On CISC machines, many instructions map to a collection of hardwired
instructions/circuits. The collection of hardwired instructions/circuits that
makes up actual instructions is called **microcode**. Microcode is like the
subroutines of CISC machine code.

*Note:* RISC designs are generally preferred over microcode currently because
RISC instructions are easier to pipeline, avoids the overhead of microcode, and
hardwired circuits can often achieve improved performance. Further, most
programming is no longer done in assembly, so the ease of use of CISC ISAs is
far less important. However, it still is important for implementations of CISC
ISAs (e.g. x86) and is neat!

*Why is microcode nice?* It allows less complicated chips to implement more
complicated instructions, that normally would only be possible on more
expensive/complicated chips. Likewise, it allows machines to emulate other
instruction sets. This capability was used by IBM in its S/360 compatible
computer architecture.

Microcode can also enable performance improvements by rewriting code in
microcode rather than machine code. *How?* The machine doesn't have to fetch or
decode any machine code, since the microcode is stored in the CPU itself.

*Why is microcode bad?* Microcode is incredibly hard for a human to use and is
incredibly powerful. Also, why bother have microcode when you could just have
simpler machine code?

## x86 String Instructions

Text processing was at the time an extremely important use for computers (and
still is to this day). Because of this Intel decided to make highly optimized
machine code instructions for doing common string operations (compare, move,
scan, load, and store). These instructions were written in hand-optimized
microcode.

These operations were written generically enough that they also allowed numeric
array manipulation.

# Interrupts and I/O

An **interrupt** is a signal to the CPU that allows it to asynchronous events.
Every interrupt that triggers has a unique integer ID. The CPU contains (and
the OS manages) an **interrupt vector table**, which maps from unique integer
ID to a list of subroutines to call in response to the interrupt.

In general, a CPU handles an interrupt by preparing for a context switch
(storing registers on stack) and then calls every interrupt handler in the
interrupt vector table sequentially. When it is done, it goes back to where it
was and restores its saved data.

Specific to the 8086, the CPU stores the flags, CS, and IP onto the stack. Then
it loads the CS and IP and jumps to the loaded CS and IP, which then executes
the interrupt handler. The interrupt handler then saves every register it
modifiers, does what it needs to do, restores the registers, and calls `iret`
(for interrupt return).

When an interrupt occurs, the CPU prepares for a context switch (by storing the
registers onto the stack) and then goes to the interrupt vector table. It then
calls the subroutine to handle the inter

*Note:* If an entry in the interrupt vector table is empty, then the interrupt
triggers a "double fault", which is like the default interrupt handler and also
the interrupt-within-an-interrupt handler.

## Security

In the early days of interrupts and interrupt handlers, there were several
security vulnerabilities.

Interrupts allowed hackers to corrupt the operating system's code by modifying
the stack to point in the middle of the operating system's code (arbitrary
changes to SP and SI were allowed) and then trigger an interrupt causing the
hardware to overwrite part of the operating system in memory. The operating
system and hardware did have ways to stop the user from directly modifying the
OS's code, but they had not thought to stop hardware interrupts from modifying
it.

This security vulnerability was solved by having the OS have a safe stack
space, which users couldn't modify. Hardware then used this safe stack space
for context switching.

## I/O

There are there main ways to do input and output:

* Programmer I/O (PIO): Very restrictive, byte oriented, hardly used anymore.
* Memory Mapped I/O (MMIO): You reserve part of your address space to
  communicate with hardware devices. You then can read/write as if this were
  real memory, even though it is actually being mapped to another devices by
  the hardware.
  * Devices us a **programmable interrupt adapter/controller**, which pretends
    to be memory and triggers interrupts.
  * Example: VGA text buffer.
* Direct Memory Access (DMA): High performance. Allows you to directly read and
  write memory on the device.
  * Used for things such as network cards and hard disks where performance is
    critical.

# Floating Point Numbers

The standard for representing floating point numbers in binary was originally
set by IEEE 754-1985 in 1985. The most up to date version of the spec is IEEE
754-2008 from 2008.

*Note:* There are some complex rules around rounding and how to deal with
infinity in the spec. For this class, we'll stick to the basic idea.

The standard specifies 3 *precisions* of floating point numbers.

* Single precision: 32 bits.
* Double precision: 64 bits.
* Quadruple precision: 128 bits.

Every precision breaks the field into a sign, exponent, and significand as
detailed below. *Note:* You always store the "normalized" form of the number,
that is in $\pm n \times 10^e$, $1 \le n < 2$.

* Sign (1 bit)
* Exponent: The exponent $e$ in $\pm n \times 10^e$. This is stored biased so
  that you have to subtract the bias from the value to get the actual exponent
  $e$. (The bias is always half of the fields maximum value.) The maximum and
  minimum exponent is always reserved for special numbers (e.g. infinity).
  * Single Precision: 8 bits and 127 is the bias.
* Significand: The fractional part of $n$. We only store the fractional part
  because we know that the bit before the decimal place will always be 1
  because we store the normalized form of the number. (This is called the
  **hidden bit**.)

*This has some pitfalls though!*

We have a limited number of digits so we can have rounding error. In general,
Single precision numbers can handle ~7-8 significant figures, with the exact
precision depending on the number.

Since we are using binary fractional parts, not all seemingly simple fractions
can be represented exactly. For example in binary $1/10$ has infinitely many
repeating digits. Of course $\pi$ also has infinitely many repeating digits.

To handle the rounding error and imprecision that is associated with floating
point, you establish a constant small value epsilon that represents an
acceptable amount of error. Then, when you check for equality, you see if the
difference between the numbers is less than epsilon.

Outside of the rounding errors, floating point number have some special numbers
that use the reserved exponents.

* $\pm 0$: Everything but sign bit is 0. Sign bit acts normally.
  * Because of the hidden bit, all zeros normally wouldn't actually be zero.
* $\pm \infty$: Exponent is maxed and significand is 0. Sign bit acts normally.
* NaN: Sign = 1, exponent is maxed, and significand is not zero.
  * All operations on NaN yield NaN.
  * Occurs when you do something invalid, like divide by zero.

Creating a NaN is an example of an exception, but there are others. Examples
include overflow and underflow. However, these exceptions have default actions
defined in the standard and it is common practice to accept the default action.

## Floating Pointer Coprocessor / Numeric Data Processor (NDP)

Historically, many computers did not have native floating point operations
(instead emulating it in software) and those who did shelled out to a
completely different chip in the system which would perform the operations.
Nowadays, most consumer computers have the floating point coprocessor on the
same chip as the main CPU, but it is still acts like a coprocessor.

Communication with the coprocessor is done via the **floating point register
stack**. The top of the stack is called `ST` or stack top. The processor treats
this as a *pure* stack, limiting you to the following operations.

* `fld dest`: Load real. Push a real number onto the stack.
* `fst[bw] dest`: Peek at the top of the stack.
* `fstp[bw] dest`: Pop a real number off of the stack.
* `fadd`: `ST(1) + ST`.
* `fsub`: `ST(1) - ST`.
* `fmul`: `ST(1) * ST`.
* `fdiv`: `ST(1) / ST`.
* `fwait`: Wait for NDP to complete store. Should be done after trying to read
  from the coprocessor.

The NDP has a **status word**, which provides information about its current
state. Two of the bits, C3 and C0, show the comparison of `ST(1)` and `ST`.

* `ST(1) > ST`: C3 = 0. C0 = 0.
* `ST(1) < ST`: C3 = 0. C0 = 1.
* `ST(1) = ST`: C3 = 1. C0 = 0.
* `ST(1) ? ST`: C3 = 1. C0 = 1. This occurs when you cannot compare the
  numbers, for example of one of the numbers is NaN.

Neat! How do we use that? Well, if you move the high byte of the NDP status
register into the low byte of the x86 status register, C3 corresponds to ZF and
C0 corresponds to CF. This correspondence was done intentionally because then
`ja`, `jb`, and `je` have their exact expected meaning.

# Computer Architecture Design

In general, shorter instructions are better (delivered faster and smaller
binaries), fixed-length instructions are better (easier to decode), and
instructions are all sized in full bytes (easier to address, no 12-bit
instructions).

## Explicit vs Implicit Operands

One important decision is the number of explicit vs implicit operands an
instruction has.

Consider four machines: M0 has no explicit operands, M1 has one, M2 has two,
and M3 has three. Let's see how they calculate `C = A + B`.

M0 is normally called a stack machine. All operations push and pop things off
the stack. Load/push and store/pop are the only exceptions and they have one
operand.

```asm
push [A]
push [B]
add
pop [C]
```

M1 is normally called accumulator machines because all loads load into the
accumulator, all arithmetic uses the accumulator as a source and a destination,
and all stores store the accumulator.

```asm
load [A]
add [B]
store [C]
```

M2 is (close to) what the 8086 is. Load and store have their two expected
operands. All arithmetic uses one of the registers as both a source and
destination.

```asm
mov [C], [A]
add [C], [B]
```

M3 is (close to) what ARM is. You explicitly list all operands for all
instructions.

```asm
add [C], [A], [B]
```

The 8086 is close to M2 because there are restrictions on what the operands can
be (i.e. no memory to memory). ARM is close to M3 because there are
restrictions on what the operands can be (i.e. only registers).

Let's pretend we have a machine with the following specs

* Cycle Time: $1$ us ($1$ MHz)
* Memory Rate: $10^6$ bytes/sec
* Fetch Instruction: $1$ us / byte
* Decode Opcode: $1$ us
* Access Data: $1$ us / operand
* Execute: $2$ us
* Opcode: $1$ byte
* Operand: $2$ bytes

This gives us the following table. *Note:* We leave off M0 because it requires
memory addressing for some instructions but not others and thus complicates
analysis.

| Part        | M1      | M2      | M3     |
|-------------|---------|---------|--------|
| Fetch       | 3       | 5       | 7      |
| Decode      | 1       | 1       | 1      |
| Data        | 1       | 2       | 3      |
| Execute     | 2       | 2       | 2      |
| 1 instr     | 7       | 10      | 13     |
| `C = A + B` | 21      | 20      | 13     |
| instr / sec | 142,857 | 100,000 | 76,923 |

Notice something from this analysis. All machines have the exact same clock
speed but execute different number of instructions per second. Further, the
machine that executes instructions the fastest was the slowest to run our
program while the machine that executes instructions the slowest was the
fastest to run our program. *Answering which machine is the fastest is
extremely difficult and will depend on the program!*

In general, to compare machines we need to know clock speed, instruction
execution rate, capability of each instruction, and a specific task to perform
(i.e. benchmark). Then, the time for the instruction is given by the following

$$\text{time} = \frac{\sum{\text{instructions}}}{\text{task}} * \frac{\text{cycles}}{\text{instr}} * \frac{\text{seconds}}{\text{cycle}}$$

*Note:* The benchmark must be fair (i.e. don't use benchmarks that are helped
special capabilities) and accurate (i.e. be careful about the compiler being
smarter than your synthetic benchmark by doing dead-code elimination, etc.).

## Caching

If we built RAM only using transistors (static RAM), it would be extremely
efficient but extremely expensive. Instead we use much cheaper static RAM using
transistors and capacitors. To get around the slow performance of dynamic RAM,
we use a very small extremely efficient cache. *Why does this work?* Many
programs exhibit locality of reference because of loops and most memory
structures are nearby each other (e.g. arrays).

*Note:* Some page replacement algorithms exhibit Belady's Anomaly, where more
cache reduces performance. Algorithms that don't exhibit this are called
**stack algorithms.**

## Pipelining

Often instructions are executed in different independent stages (e.g. fetch,
decode, execute). We can improve efficiency by always having an instruction in
each of these stages. This is called **pipelining.**

In general, this is excellent for performance. However, it does have an issue
with conditional branching. Namely, if you hit a branch you have to wait to
execute the branch to find the next instruction. This is called having a
**bubble in the pipeline.**

This can be mitigated using speculative execution, where you predict that the
branch will / won't be executed. If you guess wrong, you have to drain the
pipeline and it's just as bad as if you just waited. If you guessed right, then
it's like you had no jump.

*How do you predict whether or not you'll take the jump?* You could use a
global prediction from instructions executed. You could provide different
instructions / a bit in the opcode that says whether this jump is likely to be
taken or not and then have the compiler / programmer pick the appropriate one.
You could dynamically keep track of whether that branch tends to be taken, but
that incurs additional overhead and complexity.

This can also be mitigated by having hardware that can do the first few stages
of the pipeline for the two different possible instructions, until you figure
out which one you should have executed. That is, take both paths and clean it
up afterwards. This is the best performance always, but it is also expensive.

This can also be mitigated by using a **delayed branching architecture.** That
is, you say you will always execute the instruction immediately after a jump.
This ensures that you will never drain the pipeline or guess incorrectly and
thus improves performance. The key issue is that you need to find a instruction
that will always be executed in both cases that you can insert into the **delay
slot.** I personally am not convinced that this is better than just having
"maybe yes" vs "maybe no" jumps, especially because it gets harder the longer
your pipeline becomes since you get more and more delay slots. Some examples of
programs that use this are MIPS and SPARC.

In general, longer pipelines tend to have a faster steady state (speed once
pipeline is saturated) but slower latency (time it takes for pipeline to be
saturated). They also tend to take longer to recover from bubbles in the
pipeline. Since pipelines are drained reasonably regularly, latency is often
important.

# Newer x86

Pentium processors and beyond are actually RISC machines that have a CISC
frontend layered on top of them. Basically, they have a RISC microcode that
actually does all the work. Then they have a CISC decode, that reads in the
complex instructions and converts them into microcode that actually gets
executed. *Note:* Some RISC-like instructions, such as adding two registers,
are sent directly to the RISC core.

The Pentium did out-of-order instruction execution, more sophisticated
speculative execution using dynamic branch prediction, and did superscalar
execution.

*Note:* The Pentium 4 had a 20-stage pipeline, largely to allow it to pump up
its clock rate, since that was (and still is) huge for marketing. This was the
main motivation for Intel to have such complex and sophisticated branch
prediction.

## Branch Prediction

The original Pentium 1's branch prediction algorithm was accurate on average
75% of the time. It's algorithm was the following pseudo-code.

```nohighlight
# The 2 bit number is how many time's
# we've seen the branch since we took it,
# with 11 being the max.
history = 2 bit history of jumps taken
if branch not in history:
  if branch goes forward:
    don't take branch
  else:
    # It's probably a loop
    take branch
else:
  if history[branch] != 11:
    take branch
  else:
    don't take branch
```

This is clever because it allows us to be wrong once and still say we should
jump again to properly handle nested loops.

## Reduced Operations

Every instruction is broken down into 1-4 reduced operations (ROPS), which
specify with painful detail the steps required to perform the operation. If an
instruction (e.g. a string instruction) cannot be broken down that far, it is
passed to the microcode ROM.

These ROPS additionally have a speculative bit, that says whether the operation
is being done speculatively, meaning you may have to trash your work. These
ROPS are queued onto their appropriate unit (e.g. they need an integer ALU,
floating point ALU, load store module, jxx module, etc.). Sometimes there's
even multiple of these units for performance.

These ROPS have additional "scratch" registers which they can work with, which
the programmer does not get access to.

Scheduling these ROPS on distinct units allows for out-of-order and parallel
operation execution, which is what we want.

# Hardware Description Languages

Nowadays, most hardware is designed using a **hardware description language**,
such as Verilog that produces the actual circuitry from the hardware
description. This is advantageous because it means automated testing /
verification of hardware correctness can be done and allows much easier and
more rapid development of hardware.

Also, if the language is flexible / powerful enough, the programmer should lose
little to no control over the design of the hardware and instead is empowered
to make more powerful and complex designs.
