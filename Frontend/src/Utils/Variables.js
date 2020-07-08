var languageConfig = {
    'C++': {
        aceMode : 'c_cpp',
        languageId: 54,
        boiler: `#include <iostream>\nusing namespace std;\n\nint main() {\n\t// your code goes here\n\treturn 0;\n}`
    },
    'C': {
        aceMode : 'c_cpp',
        languageId: 50,
        boiler: `#include <stdio.h>\n\nint main(void) {\n\t// your code goes here\n\treturn 0;\n}`
    },
    'Python2.7': {
        aceMode : 'python',
        languageId: 70
    },
    'Python3.8': {
        aceMode : 'python',
        languageId: 71
    },
    'Java': {
        aceMode : 'java',
        languageId: 62,
        boiler: `import java.util.*;\nimport java.lang.*;\nimport java.io.*;\n/* Name of the class has to be "Main" only if the class is public. */\nclass Codechef\n{\n\tpublic static void main (String[] args) throws java.lang.Exception\n\t{\n\t\t// your code goes here\n\t}\n}`
    },
    'JavaScript': {
        aceMode : 'javascript',
        languageId: 63
    },
    'TypeScript': {
        aceMode : 'typescript',
        languageId: 74
    },
    'Rust': {
        aceMode : 'rust',
        languageId: 73
    },
    'Ruby': {
        aceMode : 'ruby',
        languageId: 72
    },
    'C#': {
        aceMode : 'csharp',
        languageId: 51,
        voiler: `using System;\n\npublic class Test\n{\n\tpublic static void Main()\n\t{\n\t\t// your code goes here\n\t}\n}`
    },
    'Lisp': {
        aceMode : 'lisp',
        languageId: 55
    },
    'PHP': {
        aceMode : 'php',
        languageId: 68,
        boiler: `<?php\n\n// your code goes here`
    },
    'Go': {
        aceMode : 'golang',
        languageId: 60,
        boiler: `package main\nimport "fmt"\n\nfunc main(){\n\t// your code goes here\n}`
    }
}

module.exports = languageConfig