const request = require('supertest');
const app = require('./app'); // Assuming your server exports the app object

describe('Asciidoc Converter App', () => {
    // Unit Test for Conversion Function (You might need to import or require the conversion function)
    describe('Asciidoc to HTML Conversion', () => {
        it('should convert a basic Asciidoc document to HTML', () => {
            const asciidoc = "== Hello, World!";
            const expectedHtml = "<h1>Hello, World!</h1>";
            expect(convertToHtml(asciidoc)).toEqual(expectedHtml); // Assuming convertToHtml is your function
        });
    });

    // Integration Test for /preview Endpoint
    describe('/preview Endpoint', () => {
        it('should respond with HTML for a given Asciidoc content', (done) => {
            request(app)
                .post('/preview')
                .send({ asciidoc: "== Hello, World!" })
                .expect('Content-Type', /html/)
                .expect(200, done);
        });
    });

    // End-to-End Test for Full Workflow
    describe('Full Conversion Workflow', () => {
        it('should convert Asciidoc to HTML and back to Asciidoc', (done) => {
            const originalAsciidoc = "== Hello, World!";
            request(app)
                .post('/preview')
                .send({ asciidoc: originalAsciidoc })
                .then(response => {
                    const html = response.text;
                    return request(app).post('/reverse').send({ html });
                })
                .then(response => {
                    const reversedAsciidoc = response.text;
                    expect(reversedAsciidoc).toEqual(originalAsciidoc);
                    done();
                });
        });
    });

    // Edge Case Test for Special Characters
    describe('Edge Cases', () => {
        it('should handle special characters', () => {
            const asciidoc = "== Special Characters: !@#$%^&*()";
            const expectedHtml = "<h1>Special Characters: !@#$%^&amp;*()</h1>";
            expect(convertToHtml(asciidoc)).toEqual(expectedHtml); // Assuming convertToHtml is your function
        });
    });
});
