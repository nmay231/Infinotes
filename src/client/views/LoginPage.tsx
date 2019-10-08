/** @format */

import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { Link } from 'react-router-dom'

import FormField from '../components/commons/FormField'
import FormButton from '../components/commons/FormButton'
import useLogin from '../utils/useLogin'

interface ILoginPageProps extends RouteComponentProps {}

const LoginPage: React.FC<ILoginPageProps> = ({ history, location }) => {
    let isRegister = location.pathname === '/register'

    const { loginLocal, register } = useLogin()

    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')

    const handleSubmit = async () => {
        if (isRegister) {
            if (
                !firstName.length ||
                !username.length ||
                !password.length ||
                !confirmPassword.length
            ) {
                return alert('Please fill out all required fields')
            } else if (password !== confirmPassword) {
                return alert('Passwords do not match')
            }

            if (await register(firstName, lastName, username, password)) {
                history.push('/')
            } else {
                alert('Sorry, please try again later')
            }
        } else {
            if (!username.length || !password.length) {
                return alert('Please fill out the username and password')
            }

            if (await loginLocal(username, password)) {
                history.push('/')
            } else {
                alert("Sorry, your credentials don't appear to be valid")
            }
        }
    }

    React.useEffect(() => {
        try {
            document.getElementById('First-Name').focus()
        } catch (e) {
            document.getElementById('User-Name').focus()
        }
    }, [isRegister])

    return (
        <section className="row flex-column justify-content-center align-items-center min-vh-100 min-vw-100">
            <h1 className="mb-5 text-center">
                Please {isRegister ? 'register' : 'login'} to add notes to the board
            </h1>
            <div className="col-xl-4 col-lg-6 col-md-8 col-10">
                <form className="card">
                    <div className="card-body">
                        {isRegister && (
                            <>
                                <FormField state={[firstName, setFirstName]} name="First Name" />
                                <FormField
                                    state={[lastName, setLastName]}
                                    name="Last Name"
                                    optional
                                />
                            </>
                        )}
                        <FormField state={[username, setUsername]} name="User Name" />
                        <FormField
                            state={[password, setPassword]}
                            name="Password"
                            type="password"
                        />
                        {isRegister && (
                            <FormField
                                state={[confirmPassword, setConfirmPassword]}
                                name="Confirm Password"
                                type="password"
                            />
                        )}
                    </div>
                    <div className="d-flex justify-content-center mt-n3 mb-3">
                        <FormButton click={handleSubmit} className="mr-3">
                            {isRegister ? 'Register' : 'Login'}
                        </FormButton>
                        <FormButton click={() => history.push('/')} type="secondary">
                            Cancel
                        </FormButton>
                    </div>
                    <div className="text-center mt-4 mb-2">
                        <Link to={isRegister ? '/login' : '/register'}>
                            Or go to {isRegister ? 'Login' : 'Registration'}
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default withRouter(LoginPage)
