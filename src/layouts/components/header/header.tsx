import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { AppBar, Toolbar, Badge, Hidden, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import InputIcon from "@material-ui/icons/Input";
import Navigation from "../navigation";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        boxShadow: "none"
    },
    flexGrow: {
        flexGrow: 1
    },
    signOutButton: {
        marginLeft: theme.spacing(1)
    }
}));

interface Props {
    className?: string;
    onSidebarOpen: () => void;
}

const Header: React.FC<Props> = props => {
    const { className, onSidebarOpen, ...rest } = props;

    const classes = useStyles();

    const [notifications] = useState([]);

    return (
        <AppBar {...rest} className={clsx(classes.root, className)}>
            <Toolbar>
                <Navigation />
                <RouterLink to="/">
                    <img
                        alt="Trading Manager"
                        src="./../../../../../public/app_icon.png"
                    />
                </RouterLink>
                <div className={classes.flexGrow} />
                <Hidden mdDown>
                    <IconButton color="inherit">
                        <Badge
                            badgeContent={notifications.length}
                            color="primary"
                            variant="dot"
                        >
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton
                        className={classes.signOutButton}
                        color="inherit"
                    >
                        <InputIcon />
                    </IconButton>
                </Hidden>
                <Hidden lgUp>
                    <IconButton color="inherit" onClick={onSidebarOpen}>
                        <MenuIcon />
                    </IconButton>
                </Hidden>
            </Toolbar>
        </AppBar>
    );
};

export default Header;