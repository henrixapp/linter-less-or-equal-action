# linter-less-or-equal-action

This action checks whether there are less or more linter errors than in the branch speficied. Please checkout before using actions/checkout!

## Input 

### Name 

which name this linter has

**Required** true

### cwd

workdir where to execute the commands

**Required** true

### command

command to execute 

**Required** true

### total_regexp

Regexp to search for string containing total number of errors and warnings

**Required** true


### warnings_regexp

Regexp to search for string containing total number of warnings

**Required** true

### errors_regexp

Regexp to search for string containing total number of errors

**Required** true

### compare_branch

which branch should be compared to.

**Required** true

### mode

check all files or only those who where changed.

**Required** true
## Example usage

Please make sure to checkout your project before!
```yaml
on: [push]

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    name: A job to check linter errors
    steps:
    - uses: actions/checkout@v2
    - name: Linter count
      id: hello
      uses: henrixapp/linter-less-or-equal-action@v1
      with:
        name: EsLint
        command: npx eslint  . 
        total_regexp: \d+ problems
        errors_regexp: \d+ errors
        warnings_regexp: \d+ warnings
        compare_branch: main

```
