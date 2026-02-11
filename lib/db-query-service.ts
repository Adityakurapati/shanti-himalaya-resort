import { supabase } from "@/integrations/supabase/client";

export interface DatabaseContext {
  journeys: any[];
  experientialStays: any[];
  resortPackages: any[];
}

export class DatabaseQueryService {
  async getRelevantData(query: string): Promise<DatabaseContext> {
    console.log(`🔍 DEBUG: Getting data for query: "${query}"`);
    
    const context: DatabaseContext = {
      journeys: [],
      experientialStays: [],
      resortPackages: []
    };

    try {
      // ALWAYS fetch journeys (main data users ask for)
      console.log(`🔍 DEBUG: Fetching journeys...`);
      const { data: journeys, error: journeysError } = await supabase
        .from('journeys')
        .select('title, category, duration, difficulty, description')
        .limit(6); // Increased limit

      if (journeysError) {
        console.error(`❌ DEBUG: Journeys error:`, journeysError);
      } else {
        console.log(`✅ DEBUG: Found ${journeys?.length || 0} journeys`);
        context.journeys = journeys || [];
      }

      // Fetch stays if relevant
      const lowerQuery = query.toLowerCase();
      if (lowerQuery.includes('stay') || lowerQuery.includes('package') || 
          lowerQuery.includes('price') || lowerQuery.includes('resort')) {
        console.log(`🔍 DEBUG: Fetching stays...`);
        const { data: stays, error: staysError } = await supabase
          .from('experiential_stays')
          .select('name, location, duration, description')
          .limit(4);

        if (staysError) {
          console.error(`❌ DEBUG: Stays error:`, staysError);
        } else {
          console.log(`✅ DEBUG: Found ${stays?.length || 0} stays`);
          context.experientialStays = stays || [];
        }
      }

      // Fetch packages if relevant
      if (lowerQuery.includes('package') || lowerQuery.includes('price')) {
        console.log(`🔍 DEBUG: Fetching packages...`);
        const { data: packages, error: packagesError } = await supabase
          .from('resort_packages')
          .select('name, price, duration, badge, description')
          .limit(4);

        if (packagesError) {
          console.error(`❌ DEBUG: Packages error:`, packagesError);
        } else {
          console.log(`✅ DEBUG: Found ${packages?.length || 0} packages`);
          context.resortPackages = packages || [];
        }
      }

      return context;
    } catch (error) {
      console.error(`💥 DEBUG: Database query error:`, error);
      return context;
    }
  }

  formatContextForAI(context: DatabaseContext): string {
    console.log(`🔍 DEBUG: Formatting context...`);
    
    let formatted = "";

    // Format journeys in a VERY concise way
    if (context.journeys.length > 0) {
      formatted += "JOURNEYS:\n";
      context.journeys.forEach((journey, index) => {
        formatted += `${index + 1}. ${journey.title || 'Journey'}: `;
        formatted += `${journey.duration || ''}, `;
        formatted += `${journey.difficulty || ''}, `;
        formatted += `${journey.category || ''}\n`;
        
        // VERY short description
        if (journey.description) {
          const shortDesc = journey.description.substring(0, 80);
          formatted += `   ${shortDesc}${journey.description.length > 80 ? '...' : ''}\n`;
        }
      });
      formatted += "\n";
    }

    // Format stays concisely
    if (context.experientialStays.length > 0) {
      formatted += "STAYS:\n";
      context.experientialStays.forEach((stay, index) => {
        formatted += `${index + 1}. ${stay.name || 'Stay'}: `;
        formatted += `${stay.location || ''}, `;
        formatted += `${stay.duration || ''}\n`;
        
        if (stay.description) {
          const shortDesc = stay.description.substring(0, 60);
          formatted += `   ${shortDesc}${stay.description.length > 60 ? '...' : ''}\n`;
        }
      });
      formatted += "\n";
    }

    // Format packages concisely
    if (context.resortPackages.length > 0) {
      formatted += "PACKAGES:\n";
      context.resortPackages.forEach((pkg, index) => {
        formatted += `${index + 1}. ${pkg.name || 'Package'}: `;
        formatted += `${pkg.price || ''}, `;
        formatted += `${pkg.duration || ''}, `;
        formatted += `${pkg.badge || ''}\n`;
        
        if (pkg.description) {
          const shortDesc = pkg.description.substring(0, 60);
          formatted += `   ${shortDesc}${pkg.description.length > 60 ? '...' : ''}\n`;
        }
      });
    }

    console.log(`✅ DEBUG: Formatted context length: ${formatted.length} chars`);
    return formatted;
  }
}

export const dbQueryService = new DatabaseQueryService();