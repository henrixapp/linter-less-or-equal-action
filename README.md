# linter-less-or-equal-action

This action checks whether there are less or more linter errors than in the commit before. Please checkout before

## Input 

### command


## Example usage

```yaml
uses: henrixapp/linter-less-or-equal-action@v0.1
with:
  name: EsLint
  command: npx eslint -f summary . 
  total_regexp: \d+ problems in total
  errors_regexp: \d+ errors
  problems_regexp: \d+ problems
  cwd: .
```
