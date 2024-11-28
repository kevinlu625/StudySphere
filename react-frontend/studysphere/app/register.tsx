"use client"
import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

export function Register() {

    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[email, setEmail] = useState('');
    const[error, setError] = useState('');
    const router = useRouter();

    let registerSuccessful = true;
    const callData = useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await fetch(`http://127.0.0.1:8000/function/register/username=${username}/password=${password}/email=${email}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {
            registerSuccessful = false;
            console.error("Error registering:", error)
        }
    }, []);
    
    const handleRegister= () => {
        callData;
        if (registerSuccessful) {
            router.push("/home");
        }
        
    };

    return(
    <div className="min-h-screen bg-white dark:bg-neutral-950">
        <center>
          <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
            <Box border={4} maxWidth={200} flexDirection={"column"}>
                <form onSubmit={Register}>
                    <label> 
                        Username: 
                        <input type='text' value={username} onChange={e => setUsername(e.target.value)}></input>
                    </label>
                    <label> 
                        Password: 
                        <input type='text' value={password} onChange={e => setPassword(e.target.value)}></input>
                    </label>
                    <label> 
                        Email: 
                        <input type='text' value={email} onChange={e => setEmail(e.target.value)}></input>
                    </label>
                    <Button onClick={handleRegister}>Register</Button>
                </form>
            </Box>
        </center>
      </div>
    )
}

