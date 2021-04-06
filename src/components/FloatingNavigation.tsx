import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { useStore } from '../store';

import Tooltip from './Tooltip';
import { LibraryIcon } from './icons/LibraryIcon';
import { MagnifierIcon } from './icons/MagnifierIcon';

export const FloatingNavigation: FunctionComponent = observer(() => {
  const store = useStore();
  const history = useHistory();
  const location = useLocation();

  return (
    <Wrapper>
      <nav>
        <ul>
          <Tooltip
            hover
            handler={React.forwardRef<HTMLLIElement, unknown>((_, ref) => (
              <li
                ref={ref}
                onClick={() => history.push('/dashboard')}
                className={location.pathname === '/dashboard' ? 'active' : ''}
              >
                <MagnifierIcon width="25" height="25" />
              </li>
            ))}
          >
            Search
          </Tooltip>
          <Tooltip
            hover
            handler={React.forwardRef<HTMLLIElement, unknown>((_, ref) => (
              <li
                ref={ref}
                onClick={() => history.push('/library')}
                className={location.pathname === '/library' ? 'active' : ''}
              >
                <LibraryIcon width="25" height="25" />
              </li>
            ))}
          >
            Library
          </Tooltip>
          <Tooltip
            hover
            handler={React.forwardRef<HTMLLIElement, unknown>((_, ref) => (
              <li ref={ref} className="avatar" onClick={() => store.logout()}>
                <ProfilePicture
                  style={{
                    backgroundImage: `url(${store.user.images[0].url})`,
                  }}
                />
              </li>
            ))}
          >
            Logout
          </Tooltip>
        </ul>
      </nav>
    </Wrapper>
  );
});

const ProfilePicture = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 100%;
  display: block;
  background-size: cover;
`;

const Wrapper = styled.div`
  position: fixed;
  bottom: 17px;
  width: 100%;
  display: flex;
  justify-content: center;
  nav {
    padding: 11px 13px;
    border-radius: 28px;
    background-color: #121212;
    /* background-color: #999; */
    width: 190px;
    svg {
      path {
        fill: #fff;
      }
    }
    ul {
      justify-content: space-between;
      align-items: center;
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        position: relative;
        cursor: pointer;
        line-height: 0;
        height: 28px;
        &:nth-child(1) {
          margin-left: 5px;
        }
        &.avatar {
          margin: 0;
          &::after {
            display: none;
          }
        }
        &.active,
        &:hover {
          &::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -5px;
            transform: translateX(-50%);
            background-color: #1bc47d;
            border-radius: 5px;
            width: 3px;
            height: 3px;
          }
        }
      }
    }
  }
`;