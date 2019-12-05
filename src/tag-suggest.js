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

  onSubmit = (event) => {
    event.preventDefault()
    this.props.addTag(this.state.value)
    this.setState({
      value: "",
      suggestions: [],
    })
  }

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

  onSuggestionSelected = (event, {suggestion, suggestionValue}) => {
    event.preventDefault()
    this.props.addTag(suggestionValue)
    this.setState({
      value: "",
      suggestions: [],
    })
  }

  focusTagInput() {
    this.tagInput.current.input.focus()
  }

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Add tag..',
      value,
      onChange: this.onChange,
      onSubmit: this.onSubmit,
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
        <form onSubmit={this.onSubmit}>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            theme={theme}
            ref={this.tagInput}
          />
          <input type="submit" style={{"display": "none"}} />
        </form>
      </>
    );
  }
}

export default TagSuggest;
