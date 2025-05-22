# Composio Integration & Google Chat Implementation Plan

This document outlines the plan to understand, verify, and extend the Composio integration within the AI workstation, with a specific focus on implementing Google Chat triggers and event handling.

## Phase 1: Understanding & Verification

1.  **Verify Composio Setup & Basic Connectivity (Manual Check by User):**
    *   Confirm `COMPOSIO_API_KEY` is correctly set and `ComposioClient`/`ComposioToolSet` initialize successfully.
    *   Manually check Composio dashboard for connected apps (especially Google Chat).

2.  **Test Existing Tool Functionality (Code-Assisted):**
    *   **List Connections:**
        *   Goal: Verify `/api/composio/connections` and `composio_client.list_connections()` work.
        *   Action: Use UI or direct API call.
    *   **Fetch Tools:**
        *   Goal: Verify `/api/composio/tools` and `composio_client.get_tools()` work for connected apps.
        *   Action: Small test script or use existing debug capabilities.
    *   **Execute a Simple Tool:**
        *   Goal: Verify end-to-end tool execution (e.g., list Gmail labels). Tests `/api/composio/tools/{tool_name}/execute` and `composio_client.execute_tool()`.
        *   Action: Formulate parameters for a simple tool.
    *   **Review `delete_connection` Placeholder:**
        *   Acknowledge current UI-only deletion. Actual deletion via Composio dashboard.

## Phase 2: Google Chat Trigger & Event Handling - Design & Preparation

1.  **Identify Google Chat Triggers in Composio:**
    *   Goal: Determine available Google Chat triggers (e.g., "new message") and their configuration.
    *   Action (User): Check Composio Tool Directory/documentation for `trigger_name` and schema.

2.  **Design Event Handling Workflow for Google Chat:**
    *   Goal: Outline response to Google Chat events.
    *   **Mermaid Diagram:**
        ```mermaid
        sequenceDiagram
            participant GC as Google Chat
            participant CS as Composio Service
            participant AppBE as Your App Backend
            participant AppFE as Your App Frontend/Agent
            participant LLM
            GC->>CS: New Message Event
            CS->>AppBE: Delivers Event (Webhook/Websocket)
            AppBE->>AppBE: Process Event (parse payload)
            AppBE->>LLM: (Optional) Send message content for analysis/reply generation
            LLM-->>AppBE: Suggested Reply/Action
            AppBE->>CS: Execute Composio Action (e.g., GOOGLE_CHAT_SEND_REPLY)
            CS->>GC: Post Reply in Chat
        end
        ```
    *   **Key Decisions:**
        *   Webhook or Websocket for event delivery?
        *   Information to extract from payload (sender, content, space ID, thread ID).
        *   How to invoke AI model (Gemini) with message content.
        *   Composio action for sending replies (e.g., `GOOGLE_CHAT_SEND_REPLY`) and its parameters.

3.  **Backend Implementation - Listening for Google Chat Events:**
    *   Goal: Add code to FastAPI backend to process Google Chat trigger events.
    *   **If Websockets:** Extend `backend/routes/websocket.py` or new route for `toolset.create_trigger_listener()`.
    *   **If Webhooks:** New FastAPI endpoint (e.g., `/api/composio/triggers/google_chat_event`) for POST requests.
    *   Initial logic: Log event, extract key info.

4.  **Backend Implementation - Replying to Google Chat:**
    *   Goal: Create backend function/service to send replies via `composio_client.execute_tool()` using the appropriate Google Chat action.

## Phase 3: Testing Google Chat Integration

1.  **Enable Google Chat Trigger:**
    *   Use Composio dashboard, CLI, or SDK to enable the chosen trigger with necessary configuration.
2.  **Test Event Reception:**
    *   Send a message in the configured Google Chat space.
    *   Verify backend listener receives and logs the event.
3.  **Test End-to-End Reply (Manual Trigger):**
    *   Manually invoke backend reply function with sample data to test `composio_client.execute_tool()` for sending messages.
4.  **Integrate LLM for Reply Generation:**
    *   Connect event processing to Gemini client for dynamic replies.
5.  **Full Loop Test:**
    *   Send message in Google Chat.
    *   Verify event reception, LLM processing, and reply sent back via Composio.

## Phase 4: Refinement & Further Capabilities

1.  **Error Handling & Resilience:** Implement robust error handling for API calls, trigger processing, and LLM interactions.
2.  **Context Management:** Plan for managing conversation history for follow-up interactions.
3.  **Advanced Tool Use:** Explore using other Composio tools in response to Google Chat events.
4.  **Custom Tool Processing:** Implement schema, pre, or post-processors for Google Chat tools if needed.