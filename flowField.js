autowatch = 1;

var flowField = new JitterMatrix("flowField");
var particles = new JitterMatrix("particles");
var velocity = new JitterMatrix("velocity");

var numParticles = 10000;
declareattribute("numParticles");

var flowFieldDim = 100;
declareattribute("flowFieldDim");

var speed = 0.001;
declareattribute("speed");

inlets = 4;

function Clamp(num, min, max)
{
    if(num < min)
    {
        num = min;
    }
    else if(num > max)
    {
        num = max;
    }
    return num;
}

function Update()
{
    for(var i = 0; i < numParticles; i++) 
	{
        //get position of particle: between 0 and 1
        var posX = particles.getcell(i)[0];
        var posY = particles.getcell(i)[1];

        //take the the blue channel directly
        var posZ = particles.getcell(i)[2];

        //scale to pixel dimensions of the flow field
        var scalePosX = Math.floor(posX * flowFieldDim);
        var scalePosY = Math.floor(posY * flowFieldDim);
        var scalePosZ = posZ;

        //clamp the scalePos(just to be sure)
        scalePosX = Clamp(scalePosX, 0, flowFieldDim - 1);
        scalePosY = Clamp(scalePosY, 0, flowFieldDim - 1);

        //look up the corresponding direction(vector)
        var x = flowField.getcell(scalePosX, scalePosY)[0];
        var y = flowField.getcell(scalePosX, scalePosY)[1];
        var z = flowField.getcell(scalePosZ, scalePosZ)[2];

        //normalize the vector
        var len = Math.sqrt(x * x + y * y + z * z);
        x = x/len;
        y = y/len;
        z = z/len;

        //add it to the origional position and apply velocity
        posX = posX + x * speed * velocity.getcell(i)[0];
        posY = posY + y * speed * velocity.getcell(i)[0];
        posZ = posZ + z * speed * velocity.getcell(i)[0];

        //check if position is within bounds, else assign new random position
        if(posX < 0 || posX > 1 || posY < 0 || posY > 1 || posZ < 0 || posZ > 1)
        {
            //take the first cell of the flowfield(scaled from -1 1 to 0 1) as the emitter position
            // posX = (flowField.getcell(0,0)[0] + 1) * 0.5;
            // posY = (flowField.getcell(0,0)[1] + 1) * 0.5;
            // posZ = (flowField.getcell(0,0)[2] + 1) * 0.5;

            //emit particles from the center
            // posX = 0.5;
            // posY = 0.5;
            // posZ = 0.5;

            //assign a random position
            posX = Math.random();
            posY = Math.random();
            posZ = Math.random();
        }

        //apply new position
        particles.setcell1d(i, posX, posY, posZ);
	}
}
