import React from 'react';
import Autosuggest from 'react-autosuggest';
import theme from './tag-suggest.module.css';
import { GlobalHotKeys } from "react-hotkeys";

const getSuggestions = (value, tags) => {
  const val = value.trim().toLowerCase();
  const length = value.length;

  return length === 0 ? [] : tags.filter(tag =>
    tag.toLowerCase().slice(0, length) === val
  );
};

const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => (
  <span>{suggestion}</span>
);

class TagSuggest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: []
    };
    this.tagInput = React.createRef();
    this.focusTagInput = this.focusTagInput.bind(this)
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value, this.props.allTags)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  focusTagInput() {
    this.tagInput.current.input.focus()
  }

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Tag...',
      value,
      onChange: this.onChange
    };

    const keyMap = {
      TEE: {sequence: "t", action: "keyup"},
    }

    const handlers = {
      TEE: this.focusTagInput
    }

    return (
      <>
        <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          theme={theme}
          ref={this.tagInput}
        />
      </>
    );
  }
}

export default TagSuggest;
