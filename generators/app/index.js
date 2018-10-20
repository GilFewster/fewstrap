const fs = require('fs');
const Generator = require("yeoman-generator");
const username = require("username");
const slugify = require("slugify");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.config.save();
    this.prompts = [];
    this.userPrefs = {};
    this.dotfiles = [
      "eslintrc.js", 
      "gitignore",
      "babelrc",
      "browserslistrc",
    ];
  }

  async initializing() {
    const author = await username();

    this.prompts = [
      {
        type: "input",
        name: "project",
        message: "Your Project name",
        default: this.appname
      },
      {
        type: "list",
        name: "license",
        message: "Project license",
        choices: [
          "MIT",
          "ISC",
          "APACHE-2.0",
          "UNLICENSED",
          "None"
        ],
        filter: function(val) {
          return val.replace("None","")
        }
      },
      {
        type: "input",
        name: "author",
        message: "Project author",
        default: author
      },
      {
        type: "list",
        name: "newdir",
        message: "Where do you want your project files?",
        choices: [
          {
            name: "Create a new subdirectory within the current working directory",
            value: true
          },
          {
            name: "In the current working directory",
            value: false
          }
        ]
      }
    ];

  }

  async prompting() {
    return this.prompt(this.prompts)
      .then(answers => {
        this.userPrefs = { ...answers };
        this.userPrefs.projectSlug = slugify(this.userPrefs.project, "-");
      });
  }

  writing() {
    
    if (this.userPrefs.newdir) {
      const dest = `${this.contextRoot}/${this.userPrefs.projectSlug}`;
      fs.mkdirSync(dest);
      this.destinationRoot(dest);
    }

    this.log(this.destinationRoot());

    fs.mkdirSync(`${this.destinationRoot()}/src`);
    fs.mkdirSync(`${this.destinationRoot()}/src/images`);
    fs.mkdirSync(`${this.destinationRoot()}/src/css`);

    this.dotfiles.map(fName => this._copyFile(`dotfiles/${fName}`, `.${fName}`));
    this._copyFile(`webpack.config.js`, `webpack.config.js`);
    
    this._copyTpl("_package.json", `package.json`, this.userPrefs);
    this._copyTpl("app.js", `src/js/app.js`, this.userPrefs);
    this._copyTpl("index.html", `src/html/index.html`, this.userPrefs);  
  }

  _copyFile(src, dest) {
    this.fs.copy(this.templatePath(src), this.destinationPath(dest));
  }
  _copyTpl(src, dest, template) {
    this.fs.copyTpl(this.templatePath(src), this.destinationPath(dest), template);
  }

  makePromptObject(type, name, message, defaultValue = null) {
    return defaultValue ? { type, name, message, default: defaultValue } : { type, name, message };
  }
};