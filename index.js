const express = require ('express')

const express = require ('express')
const path = require ('path')
const exphbs = require ('express-handlebars')
const app = express ()
const port = process.env.servidor ('port') 

app.engine('hbs', exphbs.engine
({ extname: '.hbs',
    partialsDir: path.join (--path.dirname,'view/partials'),
    layoutsDir: path.join(--path.dirname,layouts),
    defaultloyout: 'home'
})
);
