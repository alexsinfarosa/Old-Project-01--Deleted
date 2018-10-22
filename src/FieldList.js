import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";

import { AppConsumer } from "./AppContext";

import Grid from "@material-ui/core/Grid";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import ListIcon from "@material-ui/icons/List";
import Add from "@material-ui/icons/PlaylistAdd";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

import format from "date-fns/format";

const styles = theme => ({
  iconOnFocus: {
    color: theme.palette.primary.main,
    fontSize: 40,
    marginTop: theme.spacing.unit
  },
  iconNotOnFocus: {
    color: theme.palette.grey["500"],
    fontSize: 32
  },
  padding: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  }
});

class FieldList extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          // console.log("FieldList");
          const {
            handleIndex,
            mainIdx,
            navigateToLanding,
            fields,
            deleteField,
            selectField
          } = context;
          return (
            <Grid container>
              <Grid
                item
                xs={12}
                container
                justify="center"
                alignItems="center"
                className={classes.padding}
              >
                <Grid item xs={4} style={{ textAlign: "center" }}>
                  <HomeIcon
                    className={classes.iconNotOnFocus}
                    onClick={() => handleIndex(mainIdx - 1, "mainIdx")}
                  />
                </Grid>
                <Grid item xs={4} style={{ textAlign: "center" }}>
                  <ListIcon className={classes.iconOnFocus} />
                </Grid>
                <Grid item xs={4} style={{ textAlign: "center" }}>
                  <Add
                    className={classes.iconNotOnFocus}
                    onClick={navigateToLanding}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <List component="nav">
                  {fields.map(field => (
                    <div key={field.id}>
                      <ListItem
                        button
                        divider
                        style={{ height: 128 }}
                        onClick={() => {
                          selectField(field.id);
                          handleIndex(mainIdx - 1, "mainIdx");
                        }}
                      >
                        <ListItemText
                          primary={field.address}
                          secondary={format(
                            field.irrigationDate,
                            "MMMM do, YYYY"
                          )}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            aria-label="Delete"
                            onClick={() => deleteField(field.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </div>
                  ))}
                </List>
              </Grid>
            </Grid>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(FieldList));
