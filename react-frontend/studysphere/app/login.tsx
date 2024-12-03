import { Button, Link } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {useRouter} from "next/navigation";
import { useEffect, useState } from 'react';

export function Login() {

    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const router = useRouter();

    let loginSuccess = true;
    const callData = useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await fetch(`http://127.0.0.1:8000/function/login/username=${username}/password=${password}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                });
                console.log("IM HERE2");
            }
            console.log("DATA HERE:");
            console.log(fetchData);
            // router.push("/home");
        } catch (error) {
            loginSuccess = false;
            console.error("Error logging in:", error)
        }
    }, []);
    
    const handleRegister= () => {
        router.push("/register");
    };

    const handleLogin= () => {
        callData;
        if (loginSuccess) {
            console.log("LOGIN SUCCESS");
            router.push("/home");
        } else {
            console.log("LOGIN FAILED");
            <p>Login Failed</p>
        }
    };

    return(
    <div className="min-h-screen bg-white dark:bg-neutral-950">
        <center>
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
            <Box border={4} maxWidth={200} flexDirection={"column"}>
                <form onSubmit={Login}>
                    <label> 
                        Username: 
                        <input type='text' value={username} onChange={e => setUsername(e.target.value)}></input>
                    </label>
                    <label> 
                        Password: 
                        <input type='text' value={password} onChange={e => setPassword(e.target.value)}></input>
                    </label>
                    <Button onClick={handleLogin}>Login</Button>
                </form>
                Not a user? Register now!
                <Button onClick={handleRegister}>Register</Button>
            </Box>
        </center>
      </div>
    )
}
