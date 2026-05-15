import { Router } from "express";
import {User} from "../../types";
import {login} from "../../database"
const router = Router();

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async(req, res) => {
    const email : string = req.body.email;
    const password : string = req.body.password;
    try {
        let user : User = await login(email, password);
        delete user.password; // Paswoord mag nooit in de sessie
        req.session.user = user;
        res.redirect("/")
    } catch (e : any) {
        res.redirect("/users/login");
    }
});

export default router;