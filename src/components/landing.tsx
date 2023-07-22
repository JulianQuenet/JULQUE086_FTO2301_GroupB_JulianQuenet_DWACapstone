import React from "react";
import supabase from "../../supabaseClient";
import { useNavigate } from "react-router-dom";



interface LandingProps {
  setUser: any;
}

const Landing = (props: LandingProps) => {
  const { setUser } = props;
  const [newUser, setNewUser] = React.useState<boolean>(true);
  const navigate = useNavigate();

  const signUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      if (value === "" || value === null) return;
      data[key] = String(value);
    });

    const { email, password, username, confirmation } = data;

    if (password !== confirmation) {
      alert("Passwords do not match");
      return;
    }

    const signUp = async () => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              full_name: username,
            },
          },
        });

        if (error) throw error;
        if (!data) throw new Error("No data returned");
      } catch (error) {
        alert(error);
      }
    };

    signUp();
    e.currentTarget.reset();
    alert("Check your email for a confirmation link");
  };

  const signIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      if (value === "" || value === null) return;
      data[key] = String(value);
    });

    const { email, password } = data;

    const signIn = async () => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) throw error;
        if (!data) throw new Error("No data returned");
        setUser(data);
        navigate("/homepage");
      } catch (error) {
        alert(error);
      }
    };

    signIn();
  };

  return (
    <div className="landing">
      <div className="checkbox-wrapper-35">
        <input
          value="private"
          name="switch"
          id="switch"
          type="checkbox"
          className="switch"
          onClick={() => setNewUser(!newUser)}
        />
        <label htmlFor="switch">
          <span className="switch-x-text">Sign </span>
          <span className="switch-x-toggletext">
            <span className="switch-x-unchecked">
              <span className="switch-x-hiddenlabel">Unchecked: </span>up
            </span>
            <span className="switch-x-checked">
              <span className="switch-x-hiddenlabel">Checked: </span>in
            </span>
          </span>
        </label>
      </div>

      {newUser && (
        <div className="form-container">
          <div className="logo-container" style={{ textAlign: "center" }}>
            Create Account
          </div>

          <form className="form" id="sign-in" onSubmit={signUp}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="example@provider.com"
                required={true}
              />
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="username"
                required={true}
              />
              <label htmlFor="password">Password</label>
              <input
                type="text"
                id="password"
                name="password"
                placeholder="password"
                required={true}
              />
              <label htmlFor="confirmation">Confirm password</label>
              <input
                type="text"
                id="confirmation"
                name="confirmation"
                placeholder="password"
                required={true}
              />
            </div>

            <button className="form-submit-btn" type="submit" form="sign-in">
              Sign up
            </button>
          </form>
        </div>
      )}

      {!newUser && (
        <div className="form-container">
          <div className="logo-container" style={{ textAlign: "center" }}>
            Login
          </div>

          <form className="form" id="sign-in" onSubmit={signIn}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="example@provider.com"
                required={true}
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="password"
                required={true}
              />
            </div>

            <button className="form-submit-btn" type="submit" form="sign-in">
              Log in
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Landing;
