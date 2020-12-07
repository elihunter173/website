+++
title = "CSC 116: Introduction to Computing"
[extra]
teacher = "Dr. Matthias Stallmann"
+++

These notes originate from before I settled on using markdown and (Neo)Vim for
note-taking, so these are transcriptions from the original Google docs. I
actually took way more notes in this class, but I seem to have misplaced most
of them so here is what little I still have.

# Misc Shell Stuff

* `man COMMAND`: Show the manual entry for that command.
* Absolute Path: begins at root, starts with `/`
* Relative Path: begins at current directory, doesn’t start with anything.
* `\`: Escape character, allows for special characters to be encoded.
* `-`: Single character / short flag.
* `--`: Multiple character / long flag.
* `.`: Current directory.
* `..`: Above directory.
* `~`: Home directory.

![AFS Tree](afs_tree.png)

# Commands

* `pwd`: print working directory
* `cd [DIRNAME]`: Change directory to `DIRNAME` if specified. Otherwise home
  directory (`~`).
* `mkdir DIRNAME`: Makes new empty directory.
* `rmdir DIRNAME`: Removes directory. Fails if it is not already empty.
* `ls [PATH]`: List contents of `PATH` if specified. Otherwise current directory.
  * `-l`: List contents in long form (exact size, permission access, last
    modified, etc).
  * `-a`: list ALL content (even hidden files/directories).
* `mv SOURCE DESTINATION`: Move/rename file/directory to destination.
  * `-n`: No-clobber. Won't delete another file.
  * `-i`: Interactive. Asks before clobbering an old file.
* `cp PATH [PATH2 ...] DEST_PATH`: Copy file/directory from path (and path2
  ...) to `DEST_PATH`. If multiple paths are specified, `DEST_PATH` must be a
  directory.
  * `-R`/`-r`: recursive copy (copy directory and all subdirectories)
* `rm PATH`: Remove file.
  * `-i`: Interactive. Asks for conformation.
  * `-r`: Recursive. Removes all files and child directories.
  * `-f`: Force. Ignore all failures and go ahead at all costs.
* `chmod PERMISSIONS PATH`: Change the permissions of `PATH`. If `PERMISSIONS`
  is a 3-digit octal permission, then it sets the permissions. Otherwise, it
  modifies them based on the `ugo+-rwx` scheme.
* `diff FILE1 FILE2`: Reports differences in `FILE1` and `FILE2`. Doesn't
  display differences in binary files by default.
* `wc FILE`: Find word count, line count, character count, of `FILE`.
* `more FILE`: Scroll through the contents of `FILE`. This is called a
  **pager**.
  * q: Quit.
  * enter: See more.
  * space: Next page.
  * `/pattern`: Find pattern.
* `less filename`: Scroll through the contents of `FILE`, with the ability to
  go up and down. This is a more advanced version of `more`.
  * Flags
    * `-g`: Highlight match of searched string.
    * `-I`: Use case insensitive searches.
    * `-N`: Show line numbers.
  * Keys
    * q: Quit.
    * space: Next page.
    * d: Next half page.
    * b: Previous page.
    * u: Previous half page.
    * v: Edit command.
    * `<`: First line.
    * `>`: Last line.
    * /: Forward search.
    * ?: Backward search.
* `cat [FILE1 ...]`: Read and print file(s) as listed sequentially. It
  concatenates files! If given no files, it just forwards standard in (more on
  that later).
* `zip ZIPFILE FILE [FILE2 ...]`: Zip
  compress `FILE` (and `FILE2`) and place them into `ZIP_FILE`, creating
  `ZIPFILE` if necessary.
  * `-R`: Recursive. Used for zipping directories.
* `unzip ZIPFILE`: Unzips `ZIPFILE` and places its files in the current
  directory.
  * `-d DIRNAME`: Places unzipped files in destination dir.

# Andrew File System (AFS)

AFS uses an Access Control List (ACL) to control permissions to files and
directories. It is an extended version of the UNIX permissions system, using
the following permissions.

* a (administer): Change the entries on the ACL
* d (delete): Remove files and subdirectories from the directory or move them to other directories
* i (insert): Add files or subdirectories to the directory by copying, moving or creating
* k (lock): Set read locks or write locks on the files in the directory
* l (lookup): List the files and subdirectories in the directory, stat the directory itself, and issue the fs listacl command to examine the directory's ACL
* r (read): Read the contents of files in the directory; issue the ls -l command to stat the elements in the directory
* w (write): Modify the contents of files in the directory, and issue the UNIX chmod command to change their mode bits

These are all subcommands of the root `fs` command. That is for a command
listed as `foo`, you run `fs foo`. For more info read
http://docs.openafs.org/Reference/1/

* `la [PATH]`: List Access. Shows a list of all access permissions to current
  directory or specified directory.
* `sa PATH UNITY_ID ACCESS`: Set Access. Sets access permissions to `PATH` for
  `UNITY_ID`.
* `lq PATH`: List quota. Show how much space `PATH` is using versus your quota
  (total allowed).
* `mkm DIRPATH users.<UNITY_ID>.backup`: Make Mount. Creates backup directory
  at `DIRPATH` containing a backup of `UNITY_ID`'s home directory.
* `rmm dirname`: Remove Mount. Removes mounted directory.

# Java Commands

* `javac FILENAME.java`: Compile `.java` file into `.class`.
  * `-d DIRNAME`: places `.class` file into `DIRNAME`.
* `java FILENAME`: Runs program with filename (no extension). There must be a
  `.class` file with that name in the classpath.
  * `-cp dirname`: Modifies the classpath. Basically, you specify the location
    of the class file.

# Javadoc

```java
/**
 * This is a Javadoc comment. You must use this for programs.
 *
 * @param paramName Use this to specify parameters.
 *
 * @author authorName Use to specify the author of the code.
 */
```

# Git Commands

These are all subcommands of the root `git` command. That is for a command
listed as `foo`, you run `git foo`.

* `clone URL [DIRNAME]`: Clones git repository (repo) to the current directory
  or specified directory.
* `add PATH`: Add changes to staging area for committing.
* `commit`: Create a snapshot of the changes in the staging area and commit
  them to your current branch.
  * `-m "MESSAGE"`: Specify message with commit. Otherwise opens up
    `core.editor` to edit commit message.
* `push [BRANCH]`: Pushes most recent revision to remote repo. If you don't
  specify `BRANCH` then you're using the "upstream" branch, that is the branch
  on the server that your branch was made from. For this class it'll be master
  mostly.
* `status`: Show status of current repostiroy. Lists files added, files
  modified but unadded, etc.
* `diff FILE`: Show the differences between last commit and current status.
* `branch BRANCH`: Create a new branch off your current branch.
  * `-d`: deletes existing branch
* `checkout BRANCH`: Switch branches (and a whole bunch more).
  * `-b`: Creates branch and then switches to it.
* `log`: Shows a log of recent commits.

## Configuration

Git has a bunch of configuration values that go in your git config file. We'll
list the key nes for this class.

* `user.name`: Name of user.
* `user.email`: Email of user.
* `core.editor`: Main editor for git commit messages and other things.

# Miscellaneous EOS Notes

These may or may not apply to all computers outside of EOS. Try and see what
happens.

## Commands

* `script`: Creates a log of every command executed and its output. Used for
  E115 assignments.
  * `-f`: Force log to begin immediately.
  * `-a`: Appends the log to a previous one.
* `clear`: clears the screen
* `add`: Show list of installable programs.
* `add PROGRAM`: Add program to current session as command.
* `attach ABSOLUTE_PATH`: Create shortcut at `ABSOLUTE_PATH`.
  * for E 115 use /ncsu/e115
* `last [USER]`: Show everyone's last login or just `USER`'s.
  * `-l`: Show only last login and logout.
* `write username`: Send message to user.
* `who`: Sees who is logged in.
* `passwd`: changes password

## Shell Shortcuts

* up: Previous command.
* down: Next command.
* ctrl + c: Stop command.
* ctrl + z: Pause command.
* fg: Reopens command.
* tab: Autocomplete (iff unambiguous).
* tab x2: Show all autocomplete options.
* ";": Shows line has ended and allows multiple commands to be chained.
