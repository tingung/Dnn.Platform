import React, {Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import GridCell from "dnn-grid-cell";
import styles from "./style.less";
import {formatDate, sort} from "../../../helpers";
import Collapse from "react-collapse";
import UserMenu from "../UserMenu";
import Localization from "localization";
import { SettingsIcon, UserIcon, MoreMenuIcon, ShieldIcon } from "dnn-svg-icons";
import ColumnSizes from "../columnSizes";

class DetailsRow extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            opened: false,
            showMenu: false
        };
    }
    componentDidMount() {
        document.addEventListener("click", this.handleClick);
        this._isMounted = true;
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClick);
        this._isMounted = false;
    }
    componentWillMount() {
        let opened = (this.props.openId !== "" && this.props.id === this.props.openId);
        this.setState({
            opened
        });
    }
    handleClick(event) {
        // Note: this workaround is needed in IE. The remove event listener in the componentWillUnmount is called
        // before the handleClick handler is called, but in spite of that, the handleClick is executed. To avoid
        // the "findDOMNode was called on an unmounted component." error we need to check if the component is mounted before execute this code
        if (!this._isMounted) { return; }
        if (!ReactDOM.findDOMNode(this).contains(event.target) && (typeof event.target.className === "string" && event.target.className.indexOf("do-not-close") === -1)
            && !(event.target.id === "confirmbtn" || event.target.id === "cancelbtn") && this.props.openId !== "add") {
            if ((this.props.openId !== "" && this.props.id === this.props.openId)) {
                this.props.Collapse();
            }
        }
    }
    toggle(index) {
        if ((this.props.openId !== "" && this.props.id === this.props.openId) && this.props.currentIndex === index) {
            this.props.Collapse();
        } else {
            this.props.OpenCollapse(this.props.id, index);
        }
    }
    toggleUserMenu() {
        const show = !this.state.showMenu;
        this.setState({ showMenu: show });
    }
    /* eslint-disable react/no-danger */
    getUserActions(user, opened) {
        let actionIcons = [
            {
                index: 15,
                icon: SettingsIcon,
                title: Localization.get("ManageSettings.title")
            }
        ].concat((this.props.getUserTabsIcons && this.props.getUserTabsIcons(user)) || []);
        if (!user.isSuperUser) {
            actionIcons = actionIcons.concat([{
                index: 5,
                icon: ShieldIcon,
                title: Localization.get("ManageRoles.title")
            }]);
        }

        if (this.props.appSettings.applicationSettings.settings.isHost || this.props.appSettings.applicationSettings.settings.isAdmin) {
            actionIcons = actionIcons.concat([{
                index: 10,
                icon: UserIcon,
                title: Localization.get("ManageProfile.title")
            }]);
        }

        let i = 0;
        let userActions = sort(actionIcons, "index").map((actionIcon) => {
            let element = <div title={actionIcon.title} className={ "extension-action " + !(opened && this.props.currentIndex === i) } dangerouslySetInnerHTML={{ __html: actionIcon.icon }} onClick={ this.toggle.bind(this, i) } ></div>;
            i++;
            return element;
        });
        return userActions.concat([<div style={{ position: "relative" }}>
            <div className={"extension-action " + !this.state.showMenu} dangerouslySetInnerHTML={{ __html: MoreMenuIcon }}
                onClick={this.toggleUserMenu.bind(this) }>
            </div>
            { this.state.showMenu && <UserMenu appSettings={this.props.appSettings} getUserMenu={this.props.getUserMenu && this.props.getUserMenu.bind(this)} userMenuAction={this.props.userMenuAction && this.props.userMenuAction.bind(this)} onClose={this.toggleUserMenu.bind(this) } 
            userId={user.userId}/> }
        </div>]);
    }
    getUserColumns(user, id, opened) {
        let userActions = this.getUserActions(user, opened);
        let extraColumns = this.props.getUserColumns && this.props.getUserColumns(user);
        let columnSizes =this.props.columnSizes!==undefined? this.props.columnSizes: ColumnSizes;
        let userColumns = [
            {
                index: 5,
                content: <GridCell columnSize={columnSizes.find(x=>x.index===5).size}  className={"user-names" + (user.isDeleted ? " deleted" : "") }>
                    <h6>{user.displayName}</h6>
                    {user.displayName !== "-" && <p>{user.userName}</p> }
                </GridCell>
            },
            {
                index: 10,
                content: <GridCell columnSize={columnSizes.find(x=>x.index===10).size}  className={ user.isDeleted ? "deleted" : "" } >
                    <p>{user.email}</p>
                </GridCell >
            },
            {
                index: 15,
                content: <GridCell columnSize={columnSizes.find(x=>x.index===15).size}  className={user.isDeleted ? "deleted" : ""}>
                    {user.createdOnDate !== "-" && <p>{formatDate(user.createdOnDate) }</p>}
                    {user.createdOnDate === "-" && user.createdOnDate}
                </GridCell>
            },
            // {
            //     index: 20,
            //     content: <GridCell columnSize={columnSizes.find(x=>x.index===20).size}  className={user.isDeleted ? "deleted" : ""}>
            //         {user.authorized !== "-" && <p>{user.authorized ? Localization.get("Authorized") : Localization.get("UnAuthorized")}</p>}
            //         {user.authorized === "-" && user.authorized}
            //     </GridCell>
            // },
            {
                index: 25,
                content: id !== "add" && <GridCell columnSize={columnSizes.find(x=>x.index===25).size} style={{float:"right", textAlign:"right"}}>{userActions}</GridCell>
            }
        ].concat((extraColumns) || []);

        return sort(userColumns, "index").map((column) => {
            return column.content;
        });
    }


    render() {
        const {props} = this;
        let {user} = this.props;
        let opened = (props.openId !== "" && props.id === props.openId);
        let uniqueId = "userRow-" + Math.random() + Date.now();
        if (user === undefined) {
            user = {
                avatar: "-",
                displayName: "-",
                userName: "-",
                email: "-",
                createdOnDate: "-",
                authorized: "-"
            };
        }
        let userColumns = this.getUserColumns(user, props.id, opened);
        return (
            /* eslint-disable react/no-danger */
            <GridCell className={"collapsible-component-users"} id={uniqueId}>
                <GridCell  className={"collapsible-header-users " + !opened}>
                    <GridCell className={styles.extensionDetailRow} columnSize={100}>
                        {userColumns }
                        <Collapse accordion={true} isOpened={opened} keepCollapsedContent={true} className="user-detail-row">
                            {opened && props.children }
                        </Collapse>
                    </GridCell>
                </GridCell>
            </GridCell>
        );
    }
}

DetailsRow.propTypes = {
    user: PropTypes.object,
    OpenCollapse: PropTypes.func,
    Collapse: PropTypes.func,
    id: PropTypes.string,
    openId: PropTypes.string,
    currentIndex: PropTypes.number,
    getUserTabsIcons: PropTypes.func,
    getUserColumns: PropTypes.func,
    getUserMenu: PropTypes.func.isRequired,
    userMenuAction: PropTypes.func.isRequired,
    appSettings: PropTypes.object,
    columnSizes: PropTypes.array
};
DetailsRow.defaultProps = {
    isEvoq: false
};

export default DetailsRow;