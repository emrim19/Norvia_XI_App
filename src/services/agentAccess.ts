

export const callAgent = async (systemPrompt : string, userMessage: string) => {

    const baseUrl = import.meta.env.VITE_API_URL;
    try{
        const response = await fetch(`${baseUrl}/api/agent/interact`, {
            method: 'POST', // Must be POST to match your backend router
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                systemPrompt,
                userMessage
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch agent response');
        }

        const result = await response.json();
        return result.data;
    }
    catch(error){
        console.error("Frontend API Error:", error);
        throw error;
    }
}