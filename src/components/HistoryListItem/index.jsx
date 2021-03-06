import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  ListItem,
  ListItemIcon,
  Typography,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Fade,
  Tooltip,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Favicon from '../Favicon';
import { getDisplayUrl } from '../../lib/helpers/url-helpers';

const useStyles = makeStyles((theme) => ({
  item: {
    height: 50,
    cursor: 'pointer',
  },
  listItemText: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTime: {
    width: 70,
    marginRight: theme.spacing(2),
  },
  itemTitle: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    maxWidth: 600,
  },
}));

const HistoryListItem = ({
  item,
  isSelectedForDelete,
  handleSelectedForDelete,
  handleMoreFromThisSite,
  handleDeleteSingleItem,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    id,
    title,
    lastVisitTime,
    url,
  } = item;

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // add to items selected for deletion
  const handleCheckbox = () => {
    handleSelectedForDelete({ lastVisitTime, url });
  };

  const labelId = `checkbox-list-label-${id}`;

  const time = moment(lastVisitTime).toString();
  const displayTime = moment(lastVisitTime).format('h:mm A');
  const displayUrl = getDisplayUrl(url);

  const handleMore = () => {
    handleMoreFromThisSite(displayUrl);
    handleMenuClose(null);
  };

  const handleGoTo = () => {
    chrome.tabs.create({ url });
  };

  return (
    <ListItem key={id} className={classes.item} role="row">
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={isSelectedForDelete}
          onChange={handleCheckbox}
          tabIndex="0"
          inputProps={{ 'aria-labelledby': labelId, role: 'checkbox' }}
        />
      </ListItemIcon>
      <div className={classes.listItemText} onClick={handleCheckbox} onKeyDown={handleCheckbox} role="link" tabIndex="-1">
        <Tooltip title={time} placement="bottom" arrow aria-label="time">
          <Typography className={classes.itemTime} variant="body2" noWrap>{displayTime}</Typography>
        </Tooltip>
        <Favicon url={url} className={classes.itemIcon} />
        <Typography className={classes.itemTitle} variant="h6" noWrap>{title}</Typography>
        <Typography className={classes.itemUrl} variant="body2" noWrap>{displayUrl}</Typography>
      </div>
      <IconButton edge="end" aria-controls="history-item-menu" aria-label="options" aria-haspopup="true" onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="history-item-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleMore}>More from this site</MenuItem>
        <MenuItem onClick={() => handleDeleteSingleItem({ url })}>Remove From History</MenuItem>
        <MenuItem onClick={handleGoTo}>Go to URL</MenuItem>
      </Menu>
    </ListItem>
  );
};

HistoryListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    lastVisitTime: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  isSelectedForDelete: PropTypes.bool.isRequired,
  handleSelectedForDelete: PropTypes.func.isRequired,
  handleMoreFromThisSite: PropTypes.func.isRequired,
  handleDeleteSingleItem: PropTypes.func.isRequired,
};

export default HistoryListItem;
