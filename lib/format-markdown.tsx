export function formatMarkdownResponse(text: string): React.ReactNode[] {
  if (!text) return [<span key="empty">Loading...</span>];
  
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (!trimmed) {
      elements.push(<br key={`br-${index}`} />);
      return;
    }
    
    // Handle headers (lines with ** **)
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      elements.push(
        <h3 key={`h3-${index}`} className="text-base font-bold mt-4 mb-2 text-gray-800">
          {trimmed.slice(2, -2)}
        </h3>
      );
      return;
    }
    
    // Handle bullet points
    if (trimmed.startsWith('•')) {
      const content = trimmed.substring(1).trim();
      if (content.startsWith('**')) {
        // Bold bullet point (journey name)
        const boldMatch = content.match(/\*\*(.*?)\*\*(.*)/);
        if (boldMatch) {
          elements.push(
            <div key={`bullet-${index}`} className="flex items-start mb-1 ml-2">
              <span className="mr-2 mt-0.5 text-gray-600">•</span>
              <div className="flex-1">
                <strong className="font-semibold">{boldMatch[1]}</strong>
                <span>{boldMatch[2]}</span>
              </div>
            </div>
          );
        } else {
          elements.push(
            <div key={`bullet-${index}`} className="flex items-start mb-1 ml-2">
              <span className="mr-2 mt-0.5 text-gray-600">•</span>
              <span className="flex-1">{content.replace(/\*\*/g, '')}</span>
            </div>
          );
        }
      } else {
        // Regular bullet point
        elements.push(
          <div key={`bullet-${index}`} className="flex items-start mb-1 ml-2">
            <span className="mr-2 mt-0.5 text-gray-600">•</span>
            <span className="flex-1">{content}</span>
          </div>
        );
      }
      return;
    }
    
    // Handle checkmarks (✓)
    if (trimmed.startsWith('✓')) {
      elements.push(
        <div key={`check-${index}`} className="flex items-start mb-1 ml-2">
          <span className="mr-2 mt-0.5 text-green-600">✓</span>
          <span className="flex-1">{trimmed.substring(1).trim()}</span>
        </div>
      );
      return;
    }
    
    // Handle emoji lines (contact info)
    if (trimmed.match(/^[📞📧🌐]/)) {
      elements.push(
        <div key={`contact-${index}`} className="flex items-center mb-2 text-gray-700">
          <span className="mr-2">{trimmed.charAt(0)}</span>
          <span>{trimmed.substring(1)}</span>
        </div>
      );
      return;
    }
    
    // Regular paragraph
    elements.push(
      <p key={`para-${index}`} className="mb-3 leading-relaxed">
        {trimmed}
      </p>
    );
  });
  
  return elements;
}