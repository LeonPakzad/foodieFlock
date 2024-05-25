const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import { user } from '../controllers/userController'

export module auth {

    // access config var
    export function verifyToken(req: { cookies: { token: string; }; user: any; }, res: {  redirect: (arg0: string) => void;status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; }, next: () => void) 
    {
        try
        {
            const token = req.cookies.token;
            if(token)
                {
                    jwt.verify(token, process.env.TOKEN_SECRET, (error: string, decoded: string) => {
                if (error) return res.status(403).json({ message: 'Failed to authenticate token' });
                req.user = decoded;
                next();
            });
        }
        else
        {
            return res.status(401).json({ message: 'Token not provided' });
        }
        }
        catch (error)
        {
            console.log(error);
            res.redirect('/');
        }
    }

    export async function login(req: { body: { email: string; password: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; cookie: (arg0: string, arg1: any, arg2: { httpOnly: boolean, sameSite: string }) => void; json: (arg0: { message: string; }) => void; redirect: (arg0: string) => void}) {
        const { email, password } = req.body;
        try
        {
            const _user = await user.getUserByMail({email});
            if(_user == null) throw("Invalid username or password");

            if(_user.email != email || await bcrypt.hash(password, _user.salt) != _user.password) throw("Invalid username or password")

            // Create JWT token
            jwt.sign({ userId: _user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h' }, (error:string, token:string) => {
                if (error) {
                    return res.status(500).json({ message: 'Failed to generate token' });
                }
                
                // Set token as an HTTP cookie
                res.cookie('token', token, { httpOnly: true, sameSite: 'Strict'});
                res.json({ message: 'Login successful' });
            });

        }
        catch(error:any)
        {
            return res.status(401).json({ message: error });
        }
    }

    export async function logout(req: { headers: { [x: string]: any; }; }, res: { redirect: (arg0: string) => void; sendStatus: (arg0: number) => any; setHeader: (arg0: string, arg1: string) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; status?: string; }): void; new(): any; }; }; end: () => void; }) {
        try 
        {
            res.setHeader('Clear-Site-Data', '"cookies"');
            res.redirect('/');

        } catch (error) 
        {
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        } 
        res.end();
    }

    export async function register(req: {body: { password: string; passwordRetype: string; username: string; email: string; }; }, res: { status?: any; render?: (arg0: string, arg1: { title: string; user: { email: string; } | null; }) => void; }){
        if(req.body.password == req.body.passwordRetype) 
        {
            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(req.body.password, salt)
            const _user = ({
                name: req.body.username,
                email: req.body.email,
                password: password,
                salt: salt
            })
            await user.createUser(_user);
            return res.status(201).json(_user);
        }
        else
        {
            return res.status(500).json({ message: 'Failed to generate token'});
        }
    }
}