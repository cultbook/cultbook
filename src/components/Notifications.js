import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import {useLocation} from "react-router-dom";

import Link from "../components/Link"
import Notification from "../components/Notification"

const useStyles = makeStyles(theme => ({
  paginator: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center"
  },
}))

export default function Notifications({notifications, pageSize=10}){
  const classes = useStyles()
  const location = useLocation()
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);
  const notificationsPage = notifications.slice((page - 1) * pageSize, page * pageSize)
  const pageCount = Math.floor(notifications.length / pageSize) + ((notifications.length % pageSize === 0) ? 0 : 1)
  const multiPage = (pageCount > 1)
  const paginator = (
    <div className={classes.paginator}>
      <Pagination
        page={page}
        count={pageCount}

        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`${location.pathname}${item.page === 1 ? '' : `?page=${item.page}`}`}
            {...item}
          />
        )}
      />
    </div>
  )
  return (
    <>
      {multiPage && (
        <Grid item xs={12}>
          {paginator}
        </Grid>
      )}
      <Grid item xs={12}>
        {notificationsPage && (
          <>
            {notificationsPage.map(notification => (
              <Notification uri={notification} key={notification}/>
            ))}
          </>
        )}
      </Grid>
      {multiPage && (
        <Grid item xs={12}>
          {paginator}
        </Grid>
      )}
    </>
  )
}
