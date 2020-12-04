import React from "react";
import "../style/Highlight.css"
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: "5px",
      color: 'white',
      backgroundColor: '#3f51b5'
    },
    pos: {
      marginBottom: 12,
    },
    subsection: {
        fontWeight: 'bold'
    }
  });

export default function HighlightPopup({ highlight }){
    const classes = useStyles();
    return ( 
    highlight ? (
    <Card>
        <CardHeader
            className={classes.title}
            titleTypographyProps={{variant:'body1' }}
            title={highlight.resource.resourceName}
        />
        <CardContent>
        <Typography className={classes.subsection} variant="subtitle2" component="h2">
            Annotation Type
        </Typography>
        <Typography variant="body2" component="p">
            {highlight.resource.type}
        </Typography>
        <Typography className={classes.subsection} variant="subtitle2" component="h2">
            Property
        </Typography>
        <Typography variant="body2" component="p">
        {highlight.resource.property.label}
        </Typography>
        </CardContent>
    </Card>
  ) : null);
}