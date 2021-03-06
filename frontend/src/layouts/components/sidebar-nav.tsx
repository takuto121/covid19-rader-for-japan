import React, { forwardRef } from "react";
import { NavLink as RouterLink } from "react-router-dom";

import { makeStyles, Theme } from "@material-ui/core/styles";
import { List, ListItem, Button, colors } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

import { withRouter, match } from "react-router";
import * as H from "history";
import DialogComponent, { useDialog } from "../../components/dialog";
import AlertComponent, { useAlert } from "../../components/alert";

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    item: {
        display: "flex",
        paddingTop: 0,
        paddingBottom: 0
    },
    button: {
        color: theme.palette.background.default,
        padding: "10px 8px",
        justifyContent: "flex-start",
        textTransform: "none",
        letterSpacing: 0,
        width: "100%",
        fontWeight: theme.typography.fontWeightMedium
    },
    icon: {
        color: theme.palette.background.default,
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        marginRight: theme.spacing(1)
    },
    active: {
        color: theme.palette.background.default,
        marginRight: 10,
        backgroundColor: colors.cyan[500],
        fontWeight: theme.typography.fontWeightMedium,
    }
}));

const SidebarContainer = styled("div")({
    paddingLeft: 15
});

const CustomRouterLink = forwardRef((props: any, ref: any) => (
    <div ref={ref} style={{ flexGrow: 1 }}>
        <RouterLink {...props} />
    </div>
));

interface Props {
    history: H.History;
    location: H.Location;
    match: match;
    pages: { title: string; href: string; icon: any }[];
    onClose: () => void;
}

const SidebarNav: React.FC<Props> = props => {
    const { pages, onClose } = props;
    // alert
    const { openAlert, alertController } = useAlert()

    // dialog
    const { openDialog, dialogController } = useDialog()

    const classes = useStyles();


    return (
        <SidebarContainer>
            <List>
                {pages.map(page => (
                    <ListItem
                        className={classes.item}
                        disableGutters
                        key={page.title}
                    >
                        <Button
                            activeClassName={classes.active}
                            className={classes.button}
                            component={CustomRouterLink}
                            onClick={() => onClose()}
                            to={page.href}
                        >
                            <div className={classes.icon}> {page.icon} </div>
                            {page.title}
                        </Button>
                    </ListItem>
                ))}

            </List>
            <DialogComponent controller={dialogController} />
            <AlertComponent controller={alertController} />
        </SidebarContainer>
    );
};

export default withRouter(SidebarNav);
