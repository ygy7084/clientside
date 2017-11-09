import React from 'react';
import Content from './component/Content';

class Dialog extends React.Component {
  componentDidMount() {
    if (this.props.mode === 'modify') {
      this.props.requestItem(this.props.match.params.id);
    }
  }
  render() {
    const {
      item, title, itemStructure, handleClickControls, mode
    } = this.props;
    return (
      <Content
        title={title}
        item={item}
        itemStructure={itemStructure}
        handleClickControls={handleClickControls}
        mode={mode}
      />
    );
  }
}
export default Dialog;

