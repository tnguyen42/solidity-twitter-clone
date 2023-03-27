const { expect } = require('chai');
const { ethers } = require('hardhat');
require('chai').should();

const { expectRevert } = require('@openzeppelin/test-helpers');

describe('Twitter', () => {
  beforeEach(async () => {
    Twitter = await ethers.getContractFactory('Twitter');
    [author0, author1] = await ethers.getSigners();
    twitter = await Twitter.deploy();
  });

  describe('CRUD features', () => {
    beforeEach(async () => {
      await twitter.connect(author0).createTweet('First tweet');
    });

    it('should be able to get the first tweet', async () => {
      const tweet = await twitter.getTweet(0);

      tweet[1].should.equal('First tweet');
    });

    it('should be able to get all the tweets', async () => {
      await twitter.connect(author0).createTweet('Second tweet');
      await twitter.connect(author0).createTweet('Third tweet');

      const tweets = await twitter.getTweets();

      tweets[0].length.should.equal(3);
      tweets[1].length.should.equal(3);
      tweets[2].length.should.equal(3);

      tweets[1][1].should.equal('Second tweet');
      tweets[1][2].should.equal('Third tweet');
    });

    it('should not be able to get a tweet that does not exist', async () => {
      await twitter.getTweet(1).should.be.revertedWith('Out of range id');
    });
  });

  describe('The owner of a tweet', () => {
    it('should be able to create a new tweet', async () => {
      await twitter.connect(author1).createTweet('First tweet');
    });

    it('should be able to edit a tweet', async () => {
      await twitter.connect(author1).createTweet('First tweet');

      await twitter.connect(author1).updateTweet(0, 'My updated tweet');

      const tweet = await twitter.getTweet(0);

      tweet[1].should.equal('My updated tweet');
    });

    it('should revert when trying to read a specific tweet and there are none', async () => {
      await twitter
        .getTweet(0)
        .should.be.revertedWith('There are no tweet yet');
    });

    it('should be able to delete his own tweet', async () => {
      await twitter.connect(author1).createTweet('First tweet');
      await twitter.connect(author1).createTweet('Second tweet');

      await twitter.connect(author1).deleteTweet(0);

      const tweet0 = await twitter.getTweet(0);
      tweet0[1].should.equal('First tweet');
      tweet0[4].should.equal(true);

      const tweet1 = await twitter.getTweet(1);
      tweet1[1].should.equal('Second tweet');
      tweet1[4].should.equal(false);
    });

    it('should revert when trying to delete a tweet that is already deleted', async () => {
      await twitter.connect(author1).createTweet('First tweet');
      await twitter.connect(author1).deleteTweet(0);

      await twitter
        .connect(author1)
        .deleteTweet(0)
        .should.be.revertedWith(
          'The tweet you are to delete has already been deleted',
        );
    });
  });

  describe('Another user', () => {
    beforeEach(async () => {
      twitter = await Twitter.deploy();
      await twitter.connect(author1).createTweet('First tweet');
    });

    it('should NOT be able to edit a tweet he did not write', async () => {
      await twitter
        .connect(author0)
        .updateTweet(0, 'My updated tweet')
        .should.be.revertedWith('Only the author of this tweet can edit it');
    });

    it('should NOT be able to delete a tweet he did not write', async () => {
      await twitter
        .connect(author0)
        .deleteTweet(0)
        .should.be.revertedWith('Only the author of this tweet can delete it');
    });
  });
});
