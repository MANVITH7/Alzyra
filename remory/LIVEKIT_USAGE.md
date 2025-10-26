# LiveKit AI Agent - Usage Guide

This guide explains how to use the LiveKit AI agent in your React Native app.

## Setup

### 1. Environment Configuration

The `.env` file has been configured with your LiveKit credentials:
- `LIVEKIT_URL`: Your LiveKit server URL
- `LIVEKIT_API_KEY`: Your API key
- `LIVEKIT_API_SECRET`: Your API secret

### 2. LiveKit Agent

The agent is running in `/Users/manvithreddy/Downloads/Alzyra/alzyra` directory. Make sure it's running in `dev` mode:

```bash
cd alzyra
uv run python src/agent.py dev
```

## Using the LiveKit Context

The `useLiveKit` hook provides all the functionality you need to interact with the AI agent.

### Basic Usage

```javascript
import { useLiveKit } from '../contexts/LiveKitContext';
import * as LiveKitService from '../services/livekitService';

function YourComponent() {
  const { 
    isConnected, 
    agentMessages, 
    connectionState,
    connectToAgent,
    disconnect,
    toggleMicrophone,
    sendMessageToAgent 
  } = useLiveKit();

  // Connect to the agent
  const connect = async () => {
    try {
      // Generate a token
      const token = await LiveKitService.generateToken(
        'room-name',
        'your-name'
      );
      
      // Connect using the context
      await connectToAgent(token);
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  // Send a message to the agent
  const sendMessage = async () => {
    await sendMessageToAgent('Hello, AI agent!');
  };

  return (
    // Your UI
  );
}
```

## Available Hooks and Methods

### State

- `room`: The LiveKit room instance
- `isConnected`: Boolean indicating if connected
- `participants`: Array of participants in the room
- `isAudioEnabled`: Microphone state
- `isVideoEnabled`: Camera state
- `connectionState`: Current connection state
- `agentMessages`: Array of messages from/to the agent

### Methods

- `connectToAgent(token, options)`: Connect to the agent room
- `disconnect()`: Disconnect from the room
- `toggleMicrophone()`: Toggle microphone on/off
- `toggleCamera()`: Toggle camera on/off
- `sendMessageToAgent(message)`: Send a text message to the agent
- `clearMessages()`: Clear the message history

## Example: Testing the Connection

A test component (`AgentTest.js`) has been created to test the connection. To use it:

1. Import and add it to your navigation (temporarily for testing)
2. Navigate to the test screen
3. Tap "Connect to Agent"
4. The app will connect to the LiveKit agent
5. Messages from the agent will appear in the messages section

## Voice Interaction

The LiveKit agent supports voice interaction. When you connect:

1. The agent will listen to your microphone
2. You can speak to the agent
3. The agent will respond with voice
4. You can toggle the microphone on/off using `toggleMicrophone()`

## Integration Example

Here's how to integrate the LiveKit agent into your PatientDashboard:

```javascript
import { useLiveKit } from '../contexts/LiveKitContext';
import * as LiveKitService from '../services/livekitService';

function PatientDashboard() {
  const { 
    isConnected, 
    agentMessages,
    toggleMicrophone,
    sendMessageToAgent 
  } = useLiveKit();

  const handleConnectToAgent = async () => {
    try {
      const token = await LiveKitService.generateToken(
        `patient-${userId}`,
        patientName
      );
      await connectToAgent(token);
    } catch (error) {
      console.error('Error connecting:', error);
    }
  };

  return (
    <View>
      <Button 
        title={isConnected ? "Disconnect" : "Connect to AI"}
        onPress={isConnected ? disconnect : handleConnectToAgent}
      />
      
      {isConnected && (
        <Button 
          title="Toggle Microphone"
          onPress={toggleMicrophone}
        />
      )}
      
      {agentMessages.map((msg, i) => (
        <Text key={i}>{msg.from}: {msg.message}</Text>
      ))}
    </View>
  );
}
```

## Troubleshooting

### Agent not responding
- Make sure the agent is running: `cd alzyra && uv run python src/agent.py dev`
- Check the `.env` file has correct LiveKit credentials
- Check the console for connection errors

### Audio not working
- Make sure microphone permissions are granted
- Use `toggleMicrophone()` to enable the microphone
- Check that the agent is listening (console logs)

### Connection timeout
- Verify the LiveKit server URL is correct
- Check your internet connection
- Make sure the agent is running in `dev` mode (not `console` mode)

## Next Steps

1. Test the connection using the `AgentTest` component
2. Integrate the agent into your PatientDashboard or CaretakerDashboard
3. Customize the agent's behavior by modifying `/alzyra/src/agent.py`
4. Add UI controls for microphone, speaker, etc.
