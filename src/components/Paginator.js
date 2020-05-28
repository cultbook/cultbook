import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import {useLocation} from "react-router-dom";

import Link from "../components/Link"

const useStyles = makeStyles(theme => ({
  pagination: {
    justifyContent: "center"
  }
}))

export default function Paginator({page, pageSize, totalItems, ...props}){
  const classes = useStyles()
  const location = useLocation()
  const pageCount = Math.floor(totalItems / pageSize) + ((totalItems % pageSize === 0) ? 0 : 1)

  return (
    <div>
      <Pagination
        page={page}
        count={pageCount}
        classes={{ul: classes.pagination}}
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
}
