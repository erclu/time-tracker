# A basic tracker of time spent doing stuff

This project uses the excellent clasp to develop locally with Google's [Apps Script](https://developers.google.com/apps-script).

## An exceptional(ly bad) trick

Use a google form as target for an HTTP POST, as explained in [this stack overflow answer](https://stackoverflow.com/a/47444396)

## Development

Install dependencies with

```bash
npm install
```

To learn how to use clasp, refer to [clasp - Command Line Apps Script Projects](https://github.com/google/clasp)

> You should NOT install clasp as a global tool.
>
> clasp is installed locally and called with npx so as to NOT pollute the global registry.
>
> More info on this [here](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

I do **_NOT_** use `clasp push --watch`. I use git as a protective layer around clasp to control exactly what changed between deployments. Think of `clasp push` as an equivalent to pushing to production, or to another remote.

A PowerShell script is provided to simplify this. It ensures the index is clean and moves around a git tag.

<!-- FIXME some error with clasp pull messed up all files? -->

### VSCode

Some useful extensions:

- Prettier
- Version Lens
- Visual Studio IntelliCode
