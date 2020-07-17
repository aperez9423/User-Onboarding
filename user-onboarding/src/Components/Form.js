import React, {useState, useEffect} from "react";
import * as yup from "yup";
import axios from "axios";

let formSchema = yup.object().shape({
    name: yup.string().required("Please provide full name."),
    email: yup
        .string()
        .required("Please provide an email.")
        .email("This is not a valid email address."),
    role: yup.string(),
    password: yup
        .string()
        .min(6, "Passwords must be at least 6 characters long.") 
        .required("Password is required"),
    terms: yup
        .boolean()
        .oneOf([true], "You must accept the Terms and Conditions")
});

export default function Form () {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        terms: ""
    });
    
    const [buttonDisabled, setButtonDisabled] =useState(true);

    useEffect(() => {
        formSchema.isValid(formState)
            .then(valid => {
                setButtonDisabled(!valid);
        });
    }, [formState]);

    const [errors, setErrors] = useState({ 
        name: "",  
        email: "", 
        role: "", 
        terms: "",
        password:""
    });

    const [post, setPost] = useState([]);

    const formSubmit = e => {
        e.preventDefault();
        console.log("form submitted!");
        axios  
            .post('https://reqres.in/api/users', formState)
            .then(res => {
                setPost(res.data);
                console.log("Form has been submitted successfully.")

                setFormState({
                    name: "",
                    email: "",
                    role: "",
                    terms: "",
                    password: ""
                });
            })
            .catch(err => console.log(err.res));
        };

const validateChange = e => {
    const value = e.target.type === "checkbox" ? e.target.checked: e.target.value;
    yup 
        .reach(formSchema, e.target.name)
        .validate(value)
        .then(valid => {
            setErrors ({
                ...errors, 
                [e.target.name]: ""
            });
        })
        .catch (err => {
            setErrors({
                ...errors,
                [e.target.name]: err.errors[0]
                });
            });
        };

const inputChange = e => {
    e.persist()
    validateChange(e)
    const value =
    e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormState({
        ...formState,
        [e.target.name] : value
    });
};

return (
    <form onSubmit = {formSubmit}>
        <label htmlFor= "nameInput">
        Name
        <input
            type = "text"
            name = "name"
            onChange = {inputChange}
            value = {formState.name}
            placeholder = "Name"
        />
        {errors.name.length > 0 ? (
            <p className="error">{errors.name}</p>) : null}
        </label>
        <label htmlFor= "emailInput">
        Email
        <input
            type = "email"
            name = "email"
            onChange = {inputChange}
            value = {formState.email}
            placeholder = "Email"
        />
        {errors.email.length > 0 ? (
            <p className="error">{errors.email}</p>) : null}
        </label>
        <label htmlFor= "passwordInput">
            Password
        <input
            type = "password"
            name = "password"
            onChange = {inputChange}
            value = {formState.password}
            placeholder = "Password"
        />
        {errors.password.length > 0 ? (
            <p className="error">{errors.password}</p>) : null}
        </label>
        <label htmlFor = "role">
            What is your current role?
            <select value = {formState.role} name = "role" onChange = {inputChange}>
                <option value = "Teacher">Teacher</option>
                <option value = "Animator">Animator</option>
                <option value = "Software Engineer">Software Engineer</option>
                <option value = "Outside Sales">Outside Sales</option>
                <option value = "Self Employeed">Self Employed</option>
                <option value = "Nurse">Nurse</option>
            </select>
            {errors.role.length > 0 ? (<p className="error">{errors.role.value}</p>) : null}
        </label>
        <label className = "terms" htmlFor = "terms">
            <input 
                type= "checkbox"
                name= "terms" 
                checked= {formState.terms} 
                onChange={inputChange}/>
            Do you agree to the terms & conditions?
            {errors.terms.length > 0 ? (
                <p className="error">{errors.terms}</p> ) : null}        
        </label>
        <pre>{JSON.stringify(post, null, 2)}</pre>
        <button disabled={buttonDisabled}>Submit</button>
    </form>
    )
}
