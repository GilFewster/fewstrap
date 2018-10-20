const Generator = require("yeoman-generator");
const username = require("username");
const slugify = require("slugify");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.config.save();
    this.prompts = [];
    this.promptAnswers = {};
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
        type: "select",
        name: "author",
        message: "Project author",
        default: author
      }
    ];

  }

  async prompting() {
    return this.prompt(this.prompts).then(answers => {
      this.promptAnswers = { ...answers };
    });
  }

  writing() {
    this.log("This generator will write project files into your current directory.")
    this.log("It does NOT create a new directory for your project.")
    this.log(this.promptAnswers);
    const { project, author, license } = this.promptAnswers;
    const dotfiles = ["eslintrc.js", "gitignore"];

    dotfiles.map(fName => this._copyFile(`dotfiles/${fName}`, `.${fName}`));

    this._copyTpl("_package.json", "package.json", {
      name: slugify(project, "-"),
      author,
      license
    });
    this._copyTpl("index.js", "index.js", {
      project,
      author
    });


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
