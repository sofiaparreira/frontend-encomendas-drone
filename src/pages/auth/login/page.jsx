import React from 'react'
import InputContainer from '../../../components/InputContainer'
import ButtonDefault from '../../../components/button/ButtonDefault'
import useLoginViewModel from './useLoginViewModel'
import { FaEye, FaEyeSlash  } from "react-icons/fa6";

export default function LoginPage() {
    
    const {
        userLogin,
        setUserLogin,
        setShowPassword,
        showPassword,
        handleLogin
    } = useLoginViewModel();

    return (
        <main className="bg-white h-screen grid grid-cols-2">
            <section className='space-y-64 flex items-center'>
                <div className='px-16 w-full '>
                    <h1 className='font-bold text-blue-700 text-3xl mb-1'>Login</h1>
                    <p className='text-zinc-400 text-sm'>Este é um preview do sistema , faça login com o usuário padrão que está nos campos</p>

                    <form onSubmit={handleLogin} className='space-y-8 mt-16'>
                        <div className='space-y-3'>
                        <InputContainer 
                            label="Email" 
                            type="email" 
                            required
                            onChange={(e) => setUserLogin(prev => ({
                                ...prev, 
                                email: e.target.value
                            }))}
                            value={userLogin.email} 
                        />
                        <InputContainer
                            label="Senha" 
                            type="password" 
                            required
                            onChange={(e) => setUserLogin(prev => ({
                                ...prev, 
                                password: e.target.value
                            }))}
                            value={userLogin.password} 
                            suffix={showPassword ? <FaEye /> : <FaEyeSlash />}
                            onClickSuffix={() => setShowPassword(!showPassword)}
                        />
                        </div>
                        <ButtonDefault type={"submit"} variant='primary' text={"Login"} />
                    </form>
                </div>
                
                
            </section>
            <section className='bg-blue-700'></section>
           
        </main>
    )
}