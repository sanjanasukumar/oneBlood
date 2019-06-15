pragma solidity ^0.5.0;

contract ahack {
    // Model the donors
    struct Donor 
	{
		uint d_id;
		string name;
		string phno;
		string blood_group;
	}
	struct Recpt
	{
		uint d_id;
		string name;
		string phno;
		string hospital;
		string blood_group;
		 
	}

	struct BBcount
	{
		uint bbid;
		uint apos;
		uint bpos;
		uint opos;
		uint abpos;
		uint aneg;
		uint bneg;
		uint abneg;
		uint oneg;
		 
	}

	struct sendLog
	{
		uint sno;
		uint sdID;
		uint ssbbint;
		uint sdbbint;
		 

	}

	struct recdLog
	{
		uint rdID;
		uint rsbbint;
		uint rdbbint;
		 
	}

	//creating mapping to access donors
	mapping(uint => Donor) public donor;
	//create mapping to access recpt
	mapping(uint => Recpt) public recpt;
	//create mapping to access bbcount
	mapping(uint => BBcount) public bbcount;

	mapping(uint => sendLog) public sent;
	mapping(uint => recdLog) public rec;

	uint public donorCount;
	uint public recptCount;
	uint public bbcounter;
	uint public scount;
	uint public rcount;
	uint public e;

    
	// Constructor
    constructor () public 
	{
		

	}
	//Adding an event to reload the website on adding a new Donor
    event donorAddedEvent (
        uint indexed _dID
    );


    function addDonor(uint _dID, string memory _name, string memory _phno, string memory _bloodgroup) public 
    {
        donorCount ++;
        donor[_dID] = Donor(_dID, _name , _phno , _bloodgroup );

        //emit donorAddedEvent(_dID);
    }

    //func for recpt
    function addRecpt(uint _dID,string memory _name, string memory _phno, string memory _hospital, string memory _bloodGroup) public 
    {
        recptCount ++;
        recpt[_dID] = Recpt(_dID ,_name , _phno , _hospital, _bloodGroup);
    }

    //func to add BB
    function addBBcount(uint _bbid, uint _apos, uint _bpos, uint _opos, uint _abpos, uint _aneg , uint _bneg , uint _abneg, uint _oneg ) public 
    {
        bbcounter ++;
        bbcount[_bbid] = BBcount(_bbid, _apos, _bpos, _opos, _abpos, _aneg , _bneg , _abneg, _oneg   );
    }

    function s(uint _dID, uint _sbbint, uint _dbbint  ) public
    {
    	scount++;
    	sent[scount] = sendLog(scount,_dID, _sbbint, _dbbint   );
    }

    function r(uint _dID, uint _sbbint, uint _dbbint  ) public
    {
    	rcount++;
    	rec[_dID] = recdLog(_dID, _sbbint, _dbbint   );
    }

    function check() public
    {
    	
    	if(rcount!=scount)
    		e=1;
    	else
    	{
    		uint f=0;
    		for(uint i=1;i<=scount;i++)
    		{
    			for(uint j=1;j<=rcount;j++)
    			{

    				if(sent[i].sdID==rec[j].rdID)
    				{
    					f++;
    				}

    			}
    		}
    		if(f!=scount)
    		{
    			e=1;
    		}
    	}
    }

    
}