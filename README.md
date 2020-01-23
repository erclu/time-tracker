# A basic tracker for time spent doing stuff

This project uses clasp to develop locally Google's [Apps Scripts](https://developers.google.com/apps-script).

## Badges

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](https://commitizen.github.io/cz-cli/)
![conventional commits badge](https://github.com/erclu/time-tracker/workflows/Conventional%20Commits/badge.svg)
![source files best practices badge](https://github.com/erclu/time-tracker/workflows/Best%20practices%20for%20source%20files/badge.svg)

## An exceptional(ly bad) trick

Use a google form as target for an HTTP POST, as explained in [this stack overflow answer](https://stackoverflow.com/a/47444396)

### Now slightly less bad

The POST sender has to include a token in one of the fields, that has to match with the one saved as a script property.
If it doesn't I raise an exception and discard the values. Should be decently secure, considering the token is sent through https.

## Usage

Jeez, do I need to explain everything? just make a google sheet, a google form connected to it, create a new script project, then convert it to a full cloud platform project, enable some APIs and oh god I can't remember how I did it. And that's why you document everything, kids.

---

Currently the triggers need to be setup manually. There are 3:

1. On open -> function onOpen
2. On edit -> function installableOnEdit
3. On form submit -> function onFormSubmit

---

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

---

I DO NOT EVER USE `clasp pull`.

It got messed up along the way and now it does not transpile correctly from js to ts.

---

### VSCode

Some useful extensions:

- Prettier
- Version Lens
- Visual Studio IntelliCode
