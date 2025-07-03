# Sectorforth on V86 (within LIA Hoss)

## Introduction

Welcome to Sectorforth running in a browser! This is an implementation of Cesar Blum's original Sectorforth, a remarkably compact 16-bit x86 Forth that fits into a 512-byte boot sector. Here, it runs inside the V86 x86 emulator, allowing you to experience this minimalist Forth environment directly in your web browser.

Within the context of the LIA Hoss application, this Sectorforth emulator can be seen as a "retro computing core" or an artifact—a foundational layer of the Labyrinth to explore and interact with. Sectorforth is known for its extreme minimalism, providing only a handful of primitive operations from which more complex Forth words and programs can be built.

## Original Project

This V86-Sectorforth implementation is entirely based on the work of **Cesar Blum**. For a deep understanding of Sectorforth's design, its assembly language implementation, the Forth language principles it adheres to, and more advanced examples, please refer to the original repository:

*   **Original Sectorforth:** [https://github.com/cesarblum/sectorforth](https://github.com/cesarblum/sectorforth)

We highly recommend exploring the original project for anyone serious about understanding Forth at this low level.

## How to Run This Implementation

There are two primary ways to run this V86-Sectorforth:

### 1. Via the LIA Hoss Application

*   This is the intended way for most users of LIA Hoss.
*   After the initial LIA Hoss bootstrap sequence, you'll find an "Emulator" button (usually with a monitor icon) in the main interaction panel.
*   Clicking this button will open a floating window containing the Sectorforth emulator, ready for your input.

### 2. Standalone (for development/testing of this component)

This V86 Sectorforth instance is packaged using a set of scripts within this directory (`LIA_FC_Sectorforth`). If you wish to run or test it somewhat independently or understand its packaging:

*   **Input Files:** The necessary files for the V86 emulator (`libv86.js`, `seabios.bin`, `vgabios.bin`) and the Sectorforth disk image itself (`sectorforth.img`) are located in the `inputs/` subdirectory.
*   **Packaging Process:**
    1.  Navigate to the `LIA_FC_Sectorforth` directory (e.g., `lia_hoss/LIA_FC_Sectorforth/` or `lia_hoss/src/LIA_FC_Sectorforth/`).
    2.  Run the `main.sh` script: `bash main.sh`.
        *   This script first calls `hive_file_chunkerV2.py` to process files from `inputs/`, GZIP and Base64 encode them, and save them as JSON chunks into an `outputs/chunks/` directory.
        *   Then, it calls `create_html.sh`. This script takes the JSON chunks and embeds them into a single HTML file. For use with LIA Hoss, this output is configured to be `../../public/LIA_FC_Sectorforth/chunky.html` (relative to the script's location, assuming the script is in `lia_hoss/src/LIA_FC_Sectorforth/`). Adjust path if your structure differs.
*   **Static Files:** For the system to work within LIA Hoss (or if serving `start.html` directly), certain static files must be present in the directory Vite serves as `/LIA_FC_Sectorforth/` (typically `lia_hoss/public/LIA_FC_Sectorforth/`):
    *   `start.html` (copied from this directory)
    *   `pako_inflate.min.js` (copied from this directory)
    *   `blobHandler.js` (copied from this directory)
    *   The generated `chunky.html`
*   **Launching `start.html`:** Once these files are in place (e.g., in `lia_hoss/public/LIA_FC_Sectorforth/`), `start.html` can be loaded by the LIA Hoss application's iframe. If you were to open `lia_hoss/public/LIA_FC_Sectorforth/start.html` *directly* in a browser from the `file:///` system, you might need to launch your browser with relaxed security settings (like the `--disable-web-security` flags mentioned in `main.sh`'s Chromium launch example), but this is generally not recommended and not needed when served via HTTP by Vite.

## Interacting with Sectorforth

*   **Input:** Type your Forth code directly into the black emulator screen. Press the **Enter** key to submit the line for interpretation.
*   **Output:** Any output from your Forth commands (e.g., using `EMIT`) will appear directly on the same screen.
*   **No "ok" Prompt:** True to its minimalist nature, Sectorforth does not print an `ok` prompt after processing your input. You'll get a new line, or an error if something went wrong.
*   **Error Handling:**
    *   If you type an unknown word, Sectorforth will print `!!` in red text. This also resets the interpreter's state (clears stacks, input buffer, and returns to interpretation mode).
    *   More severe errors (like jumping to an invalid memory address) might cause the emulated machine to crash or hang, requiring a refresh/restart of the emulator window.

## Sectorforth Basics

Sectorforth provides a very small set of core building blocks. Everything else is built by defining new "words" using these primitives.

### Core Primitives

These are the fundamental operations built into Sectorforth's assembly core:

| Primitive | Stack Effect  | Description                                   |
| :-------- | :------------ | :-------------------------------------------- |
| `@`       | ( addr -- x ) | Fetch 16-bit value from memory address `addr`. |
| `!`       | ( x addr -- ) | Store 16-bit value `x` at memory address `addr`. |
| `sp@`     | ( -- sp )     | Get current data stack pointer address.       |
| `rp@`     | ( -- rp )     | Get current return stack pointer address.     |
| `0=`      | ( x -- flag ) | Returns -1 (true) if `x` is 0, else 0 (false).|
| `+`       | ( x y -- z )  | Adds `x` and `y`, leaves sum `z`.             |
| `nand`    | ( x y -- z )  | Performs bitwise NAND on `x` and `y`.         |
| `exit`    | (R: addr -- ) | (Return stack) Ends current word definition and returns to caller. |
| `key`     | ( -- char )   | Reads a single keystroke from the keyboard.   |
| `emit`    | ( char -- )   | Prints the ASCII character for `char` (low byte). |

*(R: denotes an item on the return stack)*

### System Variables (Words that push an address)

These special words, when executed, push the memory address of an internal system variable onto the data stack. You can then use `@` to fetch their value or `!` to change it.

*   **`state`**: Address of the variable holding interpreter state (0 = interpret, 1 = compile).
*   **`tib`**: Address of the Terminal Input Buffer (where your typed input goes).
*   **`>in`** (pronounced "to-in"): Address of the variable holding the current offset into the `tib` for parsing.
*   **`here`**: Address of a pointer to the next available free space in the dictionary (memory for new word definitions).
*   **`latest`**: Address of a pointer to the most recently defined word in the dictionary.

### Defining New Words (The Colon Definition)

You create new commands (called "words" in Forth) using the colon definition syntax:

```forth
: WORDNAME  ( stack-effect comment )
  ... body of the definition (other words and primitives) ...
; IMMEDIATE (optional: makes the word execute during compilation)
```

*   `:` (colon): Starts the definition of `WORDNAME`.
*   The part in `( ... )` is a comment describing what the word does to the stack and its purpose.
*   The body contains existing words or primitives.
*   `;` (semicolon): Ends the definition, compiles an `EXIT` instruction, and makes `WORDNAME` available for use.
*   `IMMEDIATE` (optional): If used, this word will execute immediately when encountered during the compilation of another word, rather than being compiled itself. `IF`, `ELSE`, `THEN`, and `;` are common immediate words.

**Example:**
To define a word `GREET` that prints "Hi!":
```forth
\ This example assumes you have a way to push numbers for ASCII codes.
\ For simplicity, let's use direct numbers here.
\ 72 is 'H', 105 is 'i', 33 is '!'
: GREET 72 EMIT 105 EMIT 33 EMIT ;

\ Now run it:
GREET
```
(This will print `Hi!`)

## Basic Usage Examples

Remember to press Enter after each line or logical block of code.

### Stack Manipulation
The data stack is central to Forth. Numbers or addresses are placed on the stack, and words operate on these values.

1.  **Pushing numbers onto the stack:**
    To push numbers, you first need to define them or have a number input routine. We'll show how to define `0` and `1` below. Once defined:
    ```forth
    1 0 1 ( Stack: ... 1 0 1 <-- top )
    ```

2.  **Viewing the Stack (Conceptual):**
    Sectorforth doesn't have a built-in `.S` (show stack) word. You'd typically define one. For learning, you infer the stack's state by how words behave or by defining simple print words.

### Simple Arithmetic
Arithmetic operations consume values from the stack and push results back on.
```forth
\ Assuming 5 and 3 are on the stack (e.g., after 1 1 + 1 + 1 + 1 +  and 1 1 + 1 + )
5 3 + ( Stack becomes: ... 8 <-- top )
```
To see the result `8`, you would need a "print number" word (which itself needs definition).

### Defining Numbers
Sectorforth requires you to explicitly define numbers or words that generate them.
```forth
\ Define -1 (all ones in 16-bit)
\ First, ensure DUP is defined (see below) if you use it here.
\ : DUP SP@ @ ; (If DUP is not yet defined)
: -1 DUP DUP NAND DUP DUP NAND NAND ;

\ Define 0 and 1 using -1, DUP, NAND, +
: 0 -1 DUP NAND ;
: 1 -1 DUP + DUP NAND ;

\ Now you can use 0 and 1:
1 1 +  \ This will leave the result of 1+1 on the stack.
       \ To see it, you'd need a number printing word.
```
*Note: The definition of `-1` uses `DUP`. Ensure `DUP` (shown below) is defined first if you enter these sequentially.*

## Building Some Common Forth Words
Here are definitions for some fundamental Forth words, adapted from `01-helloworld.f` in the original Sectorforth project.

1.  **`DUP ( x -- x x )`**
    Duplicates the top item on the stack.
    ```forth
    : DUP SP@ @ ;
    ```
    *Usage:* `1 DUP ( Stack: ... 1 1 )` (once `1` is defined and on stack)

2.  **`INVERT ( x -- !x )`**
    Bitwise NOT (achieved via NANDing with itself). Requires `DUP`.
    ```forth
    : INVERT DUP NAND ;
    ```
    *Usage:* `0 INVERT ( Stack: ... -1 )` (once `0` and `DUP` are defined)

3.  **`NEGATE ( x -- -x )`**
    Arithmetic negation (two's complement). Requires `1`, `INVERT`, and `+`.
    ```forth
    : NEGATE INVERT 1 + ;
    ```
    *Usage:* `1 NEGATE ( Stack: ... -1 )` (once `1`, `INVERT` are defined)

4.  **`OVER ( x y -- x y x )`**
    Copies the second item on the stack to the top. Requires `SP@`, `+`, and `@`.
    ```forth
    \ Define 2 first if not available: : 2 1 1 + ; (requires 1)
    : OVER SP@ 2 + @ ;
    ```
    *Usage:* `1 0 OVER ( Stack: ... 1 0 1 )` (once `1`, `0`, `2` are defined)

5.  **`SWAP ( x y -- y x )`**
    Swaps the top two items on the stack. Requires `OVER`, `SP@`, `+`, `!`.
    ```forth
    \ Define 6 first if not available: : 4 2 2 + ; : 6 2 4 + ; (requires 1, 2, 4)
    : SWAP OVER OVER SP@ 6 + ! SP@ 2 + ! ;
    ```
    *Usage:* `1 0 SWAP ( Stack: ... 0 1 )`

6.  **`NIP ( x y -- y )`**
    Effectively removes the second item from the stack. The version from `01-helloworld.f` is:
    ```forth
    \ This word is named 'drop' in 01-helloworld.f, but its stack effect is ( x y -- x )
    \ which is NIP if 'x' was the original second item and 'y' the original top.
    \ To be clearer, let's define it as NIP_LIKE_DROP for its effect ( x y -- x ).
    : NIP_LIKE_DROP ( val_under val_top -- val_under ) DUP - + ;

    \ A more standard NIP ( x y -- y ) using SWAP and the above:
    : NIP ( x y -- y ) SWAP NIP_LIKE_DROP ;
    ```
    *Usage:* `1 2 NIP ( Stack: ... 1 )` (after defining `1`, `2`, `DUP`, `SWAP`, `NIP_LIKE_DROP`)

7.  **Printing "HI" character by character using `EMIT`:**
    This requires numbers for ASCII codes.
    ```forth
    \ Assume you can push 72 (ASCII 'H') and 73 (ASCII 'I') onto the stack.
    \ (Defining arbitrary numbers like 72 from only primitives is verbose.)

    : PRINT-HI
      72 EMIT  \ Prints 'H'
      73 EMIT  \ Prints 'I'
    ;

    PRINT-HI \ Executes the word, printing "HI"
    ```
    *Note: For more complex strings, you'd typically define words like `."` and `TYPE` as shown in the original Sectorforth examples, which handle strings stored in the dictionary.*

These examples should give you a feel for how to build up functionality in Sectorforth.

## More Advanced Concepts (Brief Mention)

Sectorforth, despite its tiny size, is capable of supporting more advanced Forth constructs, including:

*   **Control Flow:** Words like `IF...ELSE...THEN`, `BEGIN...UNTIL` loops, `BEGIN...WHILE...REPEAT` loops, and `DO...LOOP` counted loops can be defined. These typically involve clever manipulation of the return stack to manage branching and looping addresses.
*   **Variables and Constants:** You can define words that behave as variables (returning an address) or constants (returning a value).
*   **Extended I/O:** More sophisticated input routines (e.g., to parse numbers from input strings) and output routines (e.g., to print numbers) can be built.
*   **Compiler Directives:** Words like `IMMEDIATE`, `[`, `]` control the compilation process itself.

Implementing these requires a deeper understanding of Forth's inner workings and how Sectorforth's primitives can be combined. For detailed examples of these advanced constructs, please consult the `examples/` directory in **Cesar Blum's original Sectorforth repository**.

## Troubleshooting / Notes

*   **Emulator Speed:** The performance of the V86 emulator can vary depending on your browser and computer's capabilities.
*   **Input Method:** Input is processed line by line. After typing your Forth code, press **Enter** to have Sectorforth interpret it.
*   **Pasting Code:**
    *   You can paste code into the emulator window.
    *   For larger blocks of code (like the examples for defining `0`, `1`, `DUP`, etc.), it's best to paste them in smaller, logical chunks (e.g., one definition at a time, or a few related definitions). Pasting very large amounts of text at once might be slow or lead to issues with the terminal input buffer (`tib`) handling within the emulator.
    *   Ensure each pasted block is followed by an Enter keystroke if it's intended to be executed immediately.
*   **Resetting:** If the emulator seems stuck or you see the red `!!` error, it means the Sectorforth interpreter has reset. Your previous definitions (if not part of the core image) might be lost, and you'll need to re-enter them. The data and return stacks are also cleared on reset.
*   **Saving Work:** This emulated Sectorforth environment does not have a persistent file system. Any words you define will be lost when you close the emulator window or refresh the page.

---

This README provides a starting point for exploring Sectorforth within the LIA Hoss environment. For the full power and intricacies of Forth and Sectorforth, the original project documentation and examples are invaluable. Happy Forthing!

