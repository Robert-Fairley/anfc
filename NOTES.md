# Development Notes

## Styling and Layout Resources

* [NYTimes: CSS Grid for Designers](https://open.nytimes.com/css-grid-for-designers-f74a883b98f5)
* [CSS Tricks: CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

## Libraries

* [DOM Library for Node/Browser: libxmljs](https://github.com/libxmljs/libxmljs)


## Test Strings

**input anf article, bare**
```js
doc = {
    components: [
        { role: "body", text: "hello world" },
        { role: "container", components: [
            { role: "body", text: "<h1>The Title</h1>" },
            { role: "photo", URL: "bundle://the-feature-image.jpeg" },
            { role: "body", text: "<p>First paragraph</p>" },
            { role: "body", text: "<p> more paragraphs</p>" },
            { role: "image", URL: "just-filename.png", caption: "This is some caption text" },
            { role: "body", text: "Thats it for this content", },
        ]},
        { role: "body", text: "This is just footer text. ALl done." },
    ],
    componentStyles: {
        lala: {
            fontSize: 1.2,
            fontStyle: "italic",
        }
    },
    componentTextStyles: {},
};
```
