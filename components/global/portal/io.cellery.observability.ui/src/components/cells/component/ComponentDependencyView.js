/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint max-len: ["off"] */

import ComponentDependencyGraph from "./ComponentDependencyGraph";
import ErrorBoundary from "../../common/error/ErrorBoundary";
import HttpUtils from "../../../utils/api/httpUtils";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import NotificationUtils from "../../../utils/common/notificationUtils";
import QueryUtils from "../../../utils/common/queryUtils";
import React from "react";
import StateHolder from "../../common/state/stateHolder";
import Typography from "@material-ui/core/Typography/Typography";
import withGlobalState from "../../common/state";
import {withStyles} from "@material-ui/core";
import withColor, {ColorGenerator} from "../../common/color";
import * as PropTypes from "prop-types";

const styles = (theme) => ({
    subtitle: {
        fontWeight: 400,
        fontSize: "1rem"
    },
    graph: {
        width: "100%",
        height: "100%"
    },
    dependencies: {
        marginTop: theme.spacing.unit * 3
    },
    graphContainer: {
        display: "flex"
    },
    diagram: {
        padding: theme.spacing.unit * 3,
        flexGrow: 1
    },
    info: {
        display: "inline-flex"
    },
    infoIcon: {
        verticalAlign: "middle",
        display: "inline-flex",
        fontSize: 18,
        marginRight: 4
    }
});

class ComponentDependencyView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                nodes: [],
                edges: []
            }
        };
    }

    componentDidMount = () => {
        const {globalState} = this.props;

        this.update(
            true,
            QueryUtils.parseTime(globalState.get(StateHolder.GLOBAL_FILTER).startTime).valueOf(),
            QueryUtils.parseTime(globalState.get(StateHolder.GLOBAL_FILTER).endTime).valueOf()
        );
    };

    update = (isUserAction, queryStartTime, queryEndTime) => {
        const {globalState, cell, component} = this.props;
        const self = this;

        const search = {
            queryStartTime: queryStartTime.valueOf(),
            queryEndTime: queryEndTime.valueOf()
        };

        if (isUserAction) {
            NotificationUtils.showLoadingOverlay("Loading Component Dependency Graph", globalState);
        }
        let url = `/dependency-model/cells/${cell}/components/${component}`;
        url += `${HttpUtils.generateQueryParamString(search)}`;
        HttpUtils.callObservabilityAPI(
            {
                url: url,
                method: "GET"
            },
            globalState
        ).then((data) => {
            // Update node,edge data to show external cell dependencies
            const nodes = [];
            const edges = [];

            data.nodes.forEach((node) => {
                if (cell === node.id.split(":")[0]) {
                    nodes.push({
                        ...node,
                        label: node.id,
                        group: "component"
                    });
                } else if (node.id.split(":")[1] === "gateway") {
                    nodes.push({
                        ...node,
                        label: node.id.split(":")[0],
                        group: "cell"
                    });
                }
            });

            data.edges.forEach((edge) => {
                if ((cell === edge.source.split(":")[0] && cell === edge.target.split(":")[0])
                    || (cell === edge.source.split(":")[0] && edge.target.split(":")[1] === "gateway")) {
                    edges.push({
                        ...edge
                    });
                }
            });

            self.setState({
                data: {
                    nodes: nodes,
                    edges: edges
                }
            });
            if (isUserAction) {
                NotificationUtils.hideLoadingOverlay(globalState);
            }
        }).catch(() => {
            if (isUserAction) {
                NotificationUtils.hideLoadingOverlay(globalState);
                NotificationUtils.showNotification(
                    "Failed to load component dependency view",
                    NotificationUtils.Levels.ERROR,
                    globalState
                );
            }
        });
    };

    onClickNode = (nodeId) => {
        // TODO: redirect to another cell view.
    };

    render = () => {
        const {classes, cell, component, colorGenerator} = this.props;
        const dependedNodeCount = this.state.data.nodes.length;
        const selectedNode = `${cell}:${component}`;


        const viewGenerator = (group, nodeId, opacity) => {
            const color = ColorGenerator.shadeColor(colorGenerator.getColor(nodeId.split(":")[0]), opacity);
            const outlineColor = ColorGenerator.shadeColor(color, -0.08);

            let cellView;

            if (group === ComponentDependencyGraph.NodeType.COMPONENT) {
                cellView = '<svg xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 14">'
                    + `<path fill="${color}"  stroke="${(selectedNode === nodeId) ? "#444" : outlineColor}" stroke-opacity="${1 - opacity}" `
                    + 'stroke-width="0.5px" d="M13,7a6,6,0,0,1-6,6.06A6,6,0,0,1,1,7,6,6,0,0,1,7,.94,6,6,0,0,1,13,7Z" transform="translate(-0.79 -0.69)"/>'
                    + '<path fill="#999" stroke="#fff" stroke-width="0.1px" d="M4.37,5c-.19.11-.19.28,0,.39L6.76,6.82a.76.76,0,0,0,.69,0L9.64,5.45a.23.23,0,0,0,0-.42L7.45,3.7a.76.76,0,0,0-.69,0Z" transform="translate(-0.79 -0.69)"/>'
                    + '<path fill="#999" stroke="#fff" stroke-width="0.1px" d="M10,5.93c0-.22-.15-.31-.34-.19L7.45,7.1a.73.73,0,0,1-.69,0L4.37,5.73c-.19-.11-.35,0-.35.2V8a.88.88,0,0,0,.33.63l2.43,1.68a.61.61,0,0,0,.65,0L9.66,8.63A.9.9,0,0,0,10,8Z" transform="translate(-0.79 -0.69)"/>'
                    + '<text fill="#fff" font-size="1.63px" font-family="ArialMT, Arial" transform="translate(5.76 5.1) scale(0.98 1)">μ</text>'
                    + "</svg>";
            } else {
                cellView
                    = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 14">'
                    + `<path fill="${color}"  stroke="${outlineColor}" stroke-opacity="${1 - opacity}" `
                    + ' stroke-width="0.5px" d="M8.92.84H5a1.45,1.45,0,0,0-1,.42L1.22,4a1.43,1.43,0,0,0-.43,1V9a1.43,1.43,0,0,0,.43,1L4,12.75a1.4,1.4,0,0,0,1,.41H8.92a1.4,1.4,0,0,0,1-.41L12.72,10a1.46,1.46,0,0,0,.41-1V5a1.46,1.46,0,0,0-.41-1L9.94,1.25A1.44,1.44,0,0,0,8.92.84Z" transform="translate(-0.54 -0.37)"/>'
                    + "</svg>";
            }

            return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cellView)}`;
        };

        const dataNodes = this.state.data.nodes;
        const dataEdges = this.state.data.edges;
        let view;

        if (dependedNodeCount > 1) {
            view = (
                <ErrorBoundary title={"Unable to Render"} description={"Unable to Render due to Invalid Data"}>
                    <ComponentDependencyGraph
                        id="component-dependency-graph"
                        nodeData={dataNodes} edgeData={dataEdges} selectedComponent={selectedNode}
                        onClickNode={this.onClickNode} viewGenerator={viewGenerator}
                        graphType="dependency" cellColor={colorGenerator.getColor(cell)}/>
                </ErrorBoundary>
            );
        } else {
            view = (
                <div>
                    <InfoOutlined className={classes.infoIcon} color="action"/>
                    <Typography variant="subtitle2" color="textSecondary" className={classes.info}>
                        {`"${component}"`} component in {`"${cell}"`} cell does not depend on any other Component
                    </Typography>
                </div>
            );
        }
        return (
            <div className={classes.dependencies}>
                <Typography color="textSecondary" className={classes.subtitle}>
                    Dependencies
                </Typography>
                <div className={classes.graphContainer}>
                    <div className={classes.diagram}>
                        {view}
                    </div>
                </div>
            </div>
        );
    }

}

ComponentDependencyView.propTypes = {
    classes: PropTypes.object.isRequired,
    cell: PropTypes.string.isRequired,
    component: PropTypes.string.isRequired,
    globalState: PropTypes.instanceOf(StateHolder).isRequired,
    colorGenerator: PropTypes.instanceOf(ColorGenerator).isRequired
};

export default withStyles(styles, {withTheme: true})(withColor(withGlobalState(ComponentDependencyView)));
