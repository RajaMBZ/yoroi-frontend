// @flow
import React, { Component } from 'react';
import type { Node } from 'react';
import { observer } from 'mobx-react';
import type { MessageDescriptor } from 'react-intl';
import { intlShape, FormattedHTMLMessage } from 'react-intl';
import { Tooltip } from 'react-polymorph/lib/components/Tooltip';
import { TooltipSkin } from 'react-polymorph/lib/skins/simple/TooltipSkin';

import InfoIcon from '../../assets/images/info-icon.inline.svg';
import styles from './CustomTooltip.scss';

type Props = {|
  +toolTip: MessageDescriptor,
  +children?: Node,
|};

@observer
export default class CustomTooltip extends Component<Props> {
  static contextTypes = { intl: intlShape.isRequired };
  static defaultProps = { children: undefined }

  render() {
    const { toolTip, children } = this.props;
    const tolltipComp = (<div><FormattedHTMLMessage {...toolTip} /></div>);
    const child = (children == null) ? this.makeDefaultChild() : children;

    return (
      <div className={styles.component}>
        <Tooltip
          className={styles.SimpleTooltip}
          skin={TooltipSkin}
          tip={tolltipComp}
        >
          {child}
        </Tooltip>
      </div>
    );
  }

  makeDefaultChild = (): Node => {
    return (
      <span className={styles.infoIcon}>
        <InfoIcon width="14" height="14" />
      </span>
    );
  }
}
