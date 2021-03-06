import React, {useState} from"react"
import Base from "../core/Base"
import {Link, Redirect} from "react-router-dom"
import {signin, authenticate, isAuthenticated} from "../auth/helper/adminIndex"

const AdminSignin = () => {

    const [values, setValues] = useState({
        username: "",
        password: "",
        error: "",
        loading: false,
        didRedirect: false
    });
    
    const { username, password, error, loading, didRedirect } = values
    const {admin} = isAuthenticated();


    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value})
    }

    const onSubmit = event => {
        event.preventDefault()
        setValues({...values, error: false, loading:true})
        signin({username, password})
        .then(data => {
            if(data.error){
                setValues({...values, error: data.error, loading: false})
            } else{
                authenticate(data, () => {
                    setValues({
                        ...values,
                        didRedirect: true
                    })
                })
            }
        })
        .catch(console.log("Error in Admin Signin"))
    };

    const onReset = event => {
        event.preventDefault()
        setValues({
                    ...values,
                    username: "",
                    password: "",
                    error: "",
                    success: false
                });
            };



    const performRedirect = () => {
        if(didRedirect){
            if(admin){
                return(
                    <Redirect to="/admin/dashboard" />
                )
            }
            
        }
        if(isAuthenticated){
            //return <Redirect to="/" />
        }
    };

    const signInForm = () => {
        return(
            <div className="row">
                <div className="col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-10 offset-1 text-left">
                    <form>
                        <div className="form-group">
                            <label className="text-light"> Username <span className="text-warning">*</span></label>
                            <input type="text"
                            value={username} onChange={handleChange("username")}
                            placeholder="Username"
                            className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label className="text-light"> Password <span className="text-warning">*</span></label>
                            <input type="password"                         
                            value={password} onChange={handleChange("password")}
                            placeholder="Password"
                            className="form-control"/>
                        </div>
                        <button className="btn btn-success btn-block rounded " onClick={onSubmit}> Submit </button>
                        <button className="btn btn-info btn-block rounded " onClick={onReset}>Reset </button>
                    </form>
                </div>
            </div>
        );
    };

    const loadingMessage = () => (
       loading && (
           <div className="alert alert-info">
               <h2>Loading Admin Dashboard...</h2>
           </div>
       )
    )

    const errorMessage = () => (
        <div className="row">
            <div className="col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-10 offset-1 text-center">
        <div className="alert alert-danger"
        style={{display: error ? "" : "none"}}
        >
            {error}
        </div>
        </div>
        </div>
    )





    return (
        <Base title="Admin Sign In Page" description="A page for admin to sign in">
            {signInForm()}
            <br/>
            {performRedirect()}
            {loadingMessage()}
            {errorMessage()}
            <br/> 
        </Base>
    );
}

export default AdminSignin;