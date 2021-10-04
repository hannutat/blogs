describe("Blog app", function() {
    beforeEach(function() {
        cy.request("POST", "http://localhost:3003/api/test/reset");
        cy.request("POST", "http://localhost:3003/api/users",
            { name: "Testimestari", username: "master", password: "qwerty" });
        cy.visit("http://localhost:3000");
    });

    it("Main view has login fields", function() {
        cy.get("#loginUsername").should("exist");
        cy.get("#loginPassword").should("exist");
    });

    it("Logging in works with correct credentials", function() {
        cy.get("#loginUsername").type("master");
        cy.get("#loginPassword").type("qwerty");
        cy.get("#loginButton").click();

        cy.contains("Testimestari logged in.");
    });

    it("Logging in does not work with incorrect credentials", function() {
        cy.get("#loginUsername").type("master");
        cy.get("#loginPassword").type("wrong");
        cy.get("#loginButton").click();

        cy.contains("Invalid username or password");
    });

    describe("When logged in", function() {
        beforeEach(function() {
            cy.request("POST", "http://localhost:3003/api/login",
                { username: "master", password: "qwerty" })
                .then(response => {
                    localStorage.setItem("loggedUser", JSON.stringify(response.body));
                    cy.visit("http://localhost:3000");
                });
        });

        it("A new blog post can be created", function() {
            cy.get("#togglableButton").click();
            cy.get("#newTitle").type("Cypress test post 1");
            cy.get("#newUrl").type("www.cypresstestpost.org");
            cy.get("#submitButton").click();

            cy.contains("Cypress test post 1 by Testimestari");
            cy.get("#detailsButton").should("exist");
        });

        it("A blog can be liked", function() {
            cy.get("#togglableButton").click();
            cy.get("#newTitle").type("Cypress test post 1");
            cy.get("#newUrl").type("www.cypresstestpost.org");
            cy.get("#submitButton").click();

            cy.get("#detailsButton").click();
            cy.get("#likeButton").click();
            cy.get(".likes").should("have.text", " 1");
        });

        it("A blog post can be deleted", function() {
            cy.get("#togglableButton").click();
            cy.get("#newTitle").type("Cypress test post 1");
            cy.get("#newUrl").type("www.cypresstestpost.org");
            cy.get("#submitButton").click();
            cy.get("#detailsButton").click();
            cy.get("#deleteButton").click();

            cy.get("#blogMain").should("not.exist");
            cy.get("#deleteButton").should("not.exist");
            cy.contains("Blog removed.");
        });

        it("A blog post can't be deleted by another user", function() {
            cy.get("#togglableButton").click();
            cy.get("#newTitle").type("Cypress test post 1");
            cy.get("#newUrl").type("www.cypresstestpost.org");
            cy.get("#submitButton").click();
            cy.get("#logoutButton").click();

            cy.request("POST", "http://localhost:3003/api/users",
                { name: "SecondUser", username: "second", password: "qwerty" });

            cy.request("POST", "http://localhost:3003/api/login",
                { username: "second", password: "qwerty" })
                .then(response => {
                    localStorage.setItem("loggedUser", JSON.stringify(response.body));
                    cy.visit("http://localhost:3000");
                });

            cy.get("#togglableButton").click();
            cy.get("#deleteButton").should("not.exist");
        });

        it("Blogs are sorted by likes", function() {

            for (let i = 1; i <= 3; i++) {
                cy.get("#togglableButton").click();
                cy.get("#newTitle").clear().type(`Cypress test post ${i}`);
                cy.get("#newUrl").clear().type("www.cypresstestpost.org");
                cy.get("#submitButton").click();
            }

            cy.get(".blogMain").should("have.length", 3);

            for (let i = 1; i <= 3; i++) {
                cy.contains(`Cypress test post ${i}`).parent().find("#detailsButton").click();
            }
            for (let i = 1; i <= 3; i++) {
                cy.contains(`Cypress test post ${i}`).parent().parent().find("#likeButton").as(`button${i}`);
            }
            for (let i = 1; i <= 7; i++) {
                cy.get("@button1").click();
                cy.wait(500);
            }
            for (let i = 1; i <= 4; i++) {
                cy.get("@button2").click();
                cy.wait(500);
            }
            for (let i = 1; i <= 16; i++) {
                cy.get("@button3").click();
                cy.wait(500);
            }

            cy.get(".likes").then( (likes) => {
                expect(likes[0].firstChild.wholeText).to.equal(" 16");
                expect(likes[1].firstChild.wholeText).to.equal(" 7");
                expect(likes[2].firstChild.wholeText).to.equal(" 4");
            });

        });

    });

});