import React, { useState, useImperativeHandle } from "react";
import Proptypes from "prop-types";
import { Button } from "@mui/material";

const Togglable = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? "none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const toggleVisibility = () => setVisible(!visible);

    useImperativeHandle(ref, () => { return { toggleVisibility }; });

    return(
        <div>
            <div style={hideWhenVisible}>
                <Button variant="contained" id="togglableButton" onClick={ toggleVisibility }>{props.buttonLabel}</Button>
            </div>
            <div style={showWhenVisible}>
                <Button variant="outlined" id="togglableButton" onClick={ toggleVisibility }>Cancel</Button>
                <br/>
                {props.children}
            </div>
        </div>
    );
});

Togglable.propTypes = {
    buttonLabel: Proptypes.string.isRequired
};

Togglable.displayName = "Togglable";

export default Togglable;