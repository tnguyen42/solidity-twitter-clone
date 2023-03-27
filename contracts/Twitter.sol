// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * @title Ethereum Twitter
 * @author Thanh-Quy Nguyen
 * @dev A light CRUD API on Ethereum
 */
contract Twitter {
  struct Tweet {
    address author;
    string content;
    uint256 timestamp;
    uint256 id;
    bool deleted;
  }

  Tweet[] private _tweets;

  /**
   * @dev A function to create tweets associated to an address
   * @param _content The content of the tweet to send
   */
  function createTweet(string memory _content) public {
    Tweet memory newTweet;
    newTweet.author = msg.sender;
    newTweet.content = _content;
    newTweet.timestamp = block.timestamp;
    newTweet.deleted = false;
    if (_tweets.length != 0) {
      newTweet.id = _tweets[_tweets.length - 1].id + 1;
    } else {
      newTweet.id = 0;
    }
    _tweets.push(newTweet);
  }

  /**
   * @dev A function to return a single tweet based on its id
   * @param _id The id of the tweet to be returned
   */
  function getTweet(
    uint256 _id
  ) public view returns (address, string memory, uint256, uint256, bool) {
    require(_tweets.length > 0, 'There are no tweet yet');
    require(_id < _tweets.length, 'Out of range id');
    return (
      _tweets[_id].author,
      _tweets[_id].content,
      _tweets[_id].timestamp,
      _id,
      _tweets[_id].deleted
    );
  }

  /**
   * @dev A function to get all of the tweets
   */
  function getTweets()
    public
    view
    returns (
      address[] memory,
      string[] memory,
      uint256[] memory,
      uint256[] memory,
      bool[] memory
    )
  {
    uint256 length = _tweets.length;

    address[] memory authors = new address[](length);
    string[] memory content = new string[](length);
    uint256[] memory timestamp = new uint256[](length);
    uint256[] memory id = new uint256[](length);
    bool[] memory deleted = new bool[](length);

    for (uint256 i = 0; i < _tweets.length; i++) {
      authors[i] = _tweets[i].author;
      content[i] = _tweets[i].content;
      timestamp[i] = _tweets[i].timestamp;
      id[i] = _tweets[i].id;
      deleted[i];
    }

    return (authors, content, timestamp, id, deleted);
  }

  /**
   * @dev A function to allow a user to edit one of his tweets
   * @param _id The id of the tweet to edit
   * @param _newContent The new content to replace the old one
   */
  function updateTweet(uint256 _id, string memory _newContent) public {
    require(
      _tweets[_id].author == msg.sender,
      'Only the author of this tweet can edit it'
    );
    require(
      _tweets[_id].deleted == false,
      'The tweet you are trying to modify has been deleted.'
    );

    _tweets[_id].content = _newContent;
  }

  /**
   * @dev A function to delete a user's tweet
   * @param _id The array of the tweet to be deleted
   */
  function deleteTweet(uint256 _id) public {
    require(
      _tweets[_id].author == msg.sender,
      'Only the author of this tweet can delete it'
    );
    require(
      _tweets[_id].deleted == false,
      'The tweet you are to delete has already been deleted'
    );

    _tweets[_id].deleted = true;
  }
}
